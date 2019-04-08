package com.jtisales;

//import android.content.Context;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.FileChannel;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import oracle.cloud.mobile.authorization.AuthType;
import oracle.cloud.mobile.authorization.AuthorizationAgent;
import oracle.cloud.mobile.authorization.AuthorizationCallback;
import oracle.cloud.mobile.authorization.User;
import oracle.cloud.mobile.exception.ServiceProxyException;
import oracle.cloud.mobile.logger.Logger;
import oracle.cloud.mobile.mobilebackend.MobileBackend;
import oracle.cloud.mobile.mobilebackend.MobileBackendManager;
import oracle.cloud.mobile.sync.RequestMethod;
import oracle.cloud.mobile.sync.SyncLocalLoadingCallback;
import oracle.cloud.mobile.sync.SyncNetworkStatus;
import oracle.cloud.mobile.sync.SyncPolicy;
import oracle.cloud.mobile.sync.SyncResourceUpdatedCallback;
import oracle.cloud.mobile.sync.Synchronization;
import oracle.cloud.mobile.sync.SynchronizationCallback;
import oracle.cloud.mobile.sync.internal.store.ResourceType;
import oracle.cloud.mobile.sync.mobileEndpoint.Comparison;
import oracle.cloud.mobile.sync.mobileEndpoint.FetchCollectionBuilder;
import oracle.cloud.mobile.sync.mobileEndpoint.MobileEndpoint;
import oracle.cloud.mobile.sync.mobileEndpoint.MobileEndpointCallback;
import oracle.cloud.mobile.sync.mobileEndpoint.MobileObject;
import oracle.cloud.mobile.sync.mobileEndpoint.MobileObjectCollection;
import oracle.cloud.mobile.sync.mobileEndpoint.MobileResource;
import oracle.cloud.mobile.utils.IOUtils;

import static oracle.cloud.mobile.sync.SyncPolicy.UPDATE_POLICY_QUEUE_IF_OFFLINE;

public class SyncManager extends ReactContextBaseJavaModule {

    interface FindObjectCallback {
        void onFindObject(List<MobileObject> objects);
    }

    interface SyncFailCompletionCallback {
        void onFinish(Boolean status);
    }

    private TreeSet<MobileObjectPriority> syncFailedMobileObjects;
    private static String TAG = "SyncManager";
    private static String kAppPref = "kAppPref";
    private static String kUserProperty = "kUserProperty";
    private static String kSyncCollectionObject = "SyncCollectionObject";

    private static AuthorizationAgent mAuthorization;

    public SyncManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private String currentCountry;

    @Override
    public String getName() {
        return "SyncManager";
    }

    private static final String LOGIN_ERROR = "LOGIN_ERROR";

    private String getCurrencyCode(){
        if (currentCountry == "CA"){
            return "CAD";
        }
        else{
            return  "EUR";
        }
    }

    @ReactMethod
    public void fetchSampleBusinessRulesJSON(final Promise promise) {
        String json = "";
        try {
            InputStream is = getCurrentActivity().getAssets().open("BusinessRules.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
            promise.resolve(json);
        } catch (IOException ex) {
            ex.printStackTrace();
            promise.reject("BUSINESS RULES FETCH FAILED","RULES NOT FOUND",ex);
        }
    }


    @ReactMethod
    public void updateCountryCode(String country) {
        currentCountry = country;
    }

    @ReactMethod
    public void setOfflineMode(ReadableMap isOffline) {
        try{
            MCSSyncManager.getManager().getMcsSynchronization().setOfflineMode(!isOffline.getBoolean("connectivity"));
        }catch (Exception e){

        }
    }

    @ReactMethod
    public void AuthenticateMCS(String userName, String password, final Promise promise) {

        AuthorizationCallback mLoginCallback = new AuthorizationCallback() {
            @Override
            public void onCompletion(ServiceProxyException exception) {

                if (exception != null) {
                    Logger.error(TAG, "Exception while receiving the Access Token", exception);
                    promise.reject("LOGIN_FAILED",exception);
                } else {
                    syncFailedMobileObjects = new TreeSet<>( new SortByPriorityMobileObject());
                    //TODO: Correct the below method, currently we are getting a crash when accessing getNetworkStatus()
                    if (MCSSyncManager.getManager().getMcsSynchronization().getNetworkStatus() == SyncNetworkStatus.SyncOnline){
                        User user = mAuthorization.getCurrentUser();
                        try{
                            JSONObject response = new JSONObject();

                            Gson userGson = new Gson();
                            String userJSONString =  userGson.toJson(user.getProperties());

                            response.put("success",true);
                            response.put("userProperties",new JSONObject(userJSONString));

                            //Saving data to shared prefrences, so we can use while offline login.
                            ReactApplicationContext context = getReactApplicationContext();
                            SharedPreferences preferences = context.getSharedPreferences(kAppPref, Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = preferences.edit();
                            editor.putString(kUserProperty,userJSONString);
                            editor.commit();

                            promise.resolve( SyncUtil.convertJsonToMap(response));
                        }catch (Exception e){
                            promise.reject("LOGIN_FAILED",exception);
                            Logger.error(TAG, "Authorization fail"+e.getMessage());
                        }
                    }else{
                        ReactApplicationContext context = getReactApplicationContext();
                        SharedPreferences preferences = context.getSharedPreferences(kAppPref, Context.MODE_PRIVATE);
                        String userJSONString = preferences.getString(kUserProperty,null);
                        if (userJSONString == null) {
                            promise.reject("LOGIN_FAILED","User not found");
                        }else{
                            try{
                                JSONObject response = new JSONObject();
                                response.put("success",true);
                                response.put("userProperties",new JSONObject(userJSONString));
                                promise.resolve( SyncUtil.convertJsonToMap(response));
                            }catch (Exception e){
                                promise.reject("LOGIN_FAILED",exception);
                                Logger.error(TAG, "Authorization fail"+e.getMessage());
                            }
                        }
                    }
                }
            }
        };

        try {
            ReactApplicationContext context = getReactApplicationContext();
            MobileBackend mobileBackend = MobileBackendManager.getManager().getDefaultMobileBackend(context);
            mAuthorization = mobileBackend.getAuthorization(AuthType.BASIC_AUTH);
            MCSSyncManager.getManager().setAuthorizationAgent(mAuthorization);
            MCSSyncManager.getManager().setMobileBackend(mobileBackend);
            mAuthorization.authenticate(context,userName,password,mLoginCallback);
        } catch (Exception e) {
            promise.reject(LOGIN_ERROR, e);
        }
    }

    @ReactMethod
    public void fetchObjects(String apiName, String endPoint, final Promise promise) {

        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        FetchCollectionBuilder builder = mobileEndpoint.fetchObjects();
        SyncPolicy policy = builder.getPolicy();
        policy.setFetchPolicy(SyncPolicy.FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY);
        try{
            builder.withPolicy(policy).execute(new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    try{
                        MobileObjectCollection collection = (MobileObjectCollection) mobileResource;
                        List<MobileObject> objects = collection.getObjectsList();
                        JSONArray jsonArray = new JSONArray();
                        for (MobileObject mobileObject:objects
                                ) {
                            jsonArray.put(mobileObject.getJsonObject());
                        }
                        promise.resolve(SyncUtil.convertJsonToArray(jsonArray));
                    }catch(Exception ex){
                        promise.reject("OBJECT_FETCH_FAILED",ex);
                    }
                }
            });
        }catch (Exception e){
            promise.reject("OBJECT_FETCH_FAILED",e);
        }
    }

    @ReactMethod
    public void fetchObjectsWithFilters(List<ReadableMap> filters ,String apiName, String endPoint, final Promise promise) {

        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        FetchCollectionBuilder builder = mobileEndpoint.fetchObjects();
        SyncPolicy policy = builder.getPolicy();
        policy.setFetchPolicy(SyncPolicy.FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY);
        for (ReadableMap filter:
             filters) {
            Comparison comparator = Comparison.Equals;
            String key = filter.getString("key");
            String comparison = filter.getString("op");
            String value = filter.getString("value");
            if (comparison.equals("NotEquals")){
                comparator = Comparison.NotEquals;
            }else if(comparison.equals("LessThan")){
                comparator = Comparison.LessThan;
            }else if(comparison.equals("GreaterThan")){
                comparator = Comparison.GreaterThan;
            }else if(comparison.equals("LessThanOrEqual")){
                comparator = Comparison.LessThanOrEqual;
            }else if(comparison.equals("GreaterThanOrEqual")){
                comparator = Comparison.GreaterThanOrEqual;
            }
            builder = builder.queryFor(key,comparator,value);
        }
        try{
            builder.withPolicy(policy).execute(new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    try{
                        MobileObjectCollection collection = (MobileObjectCollection) mobileResource;
                        List<MobileObject> objects = collection.getObjectsList();
                        JSONArray jsonArray = new JSONArray();
                        for (MobileObject mobileObject:objects
                                ) {
                            jsonArray.put(mobileObject.getJsonObject());
                        }
                        promise.resolve(SyncUtil.convertJsonToArray(jsonArray));
                    }catch(Exception ex){
                        promise.reject("OBJECT_FETCH_FAILED",ex);
                    }
                }
            });
        }catch (Exception e){
            promise.reject("OBJECT_FETCH_FAILED",e);
        }
    }

    @ReactMethod
    public void loadDataForEntity(String apiName, final String endPoint, final Promise promise) {

        ReactApplicationContext context = getReactApplicationContext();
        final SharedPreferences preferences = context.getSharedPreferences(kAppPref, Context.MODE_PRIVATE);
        final SharedPreferences.Editor editor = preferences.edit();
        final Set<String> collections =  preferences.getStringSet(kSyncCollectionObject,new HashSet<String>());

        if (collections.contains(endPoint)) {
            promise.resolve(true);
        }else{
            Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
            final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

            FetchCollectionBuilder builder = mobileEndpoint.fetchObjects();
            SyncPolicy policy = builder.getPolicy();
            policy.setFetchPolicy(SyncPolicy.FETCH_POLICY_FETCH_FROM_SERVICE);
            try{
                builder.withPolicy(policy).execute(new MobileEndpointCallback() {
                    @Override
                    public void onComplete(Exception e, MobileResource mobileResource) {
                        if (e != null) {
                            promise.reject("LOAD_DATA_FAILED",e);
                        }else{
                            promise.resolve(true);
                            //Save the endpoint to SavePreferences.
                            collections.add(endPoint);
                            editor.putStringSet(kSyncCollectionObject,collections);
                            editor.commit();
                        }
                    }
                });
            }catch (Exception e){
                promise.reject("OBJECT_FETCH_FAILED",e);
            }
        }
    }

    @ReactMethod
    public void logoutMCS(final Promise promise) {
        try {
            final ReactApplicationContext context = getReactApplicationContext();
            MobileBackend mobileBackend = MobileBackendManager.getManager().getDefaultMobileBackend(context);
            AuthorizationAgent auth = mobileBackend.getAuthorization();
            auth.logout(context, new AuthorizationCallback() {
                @Override
                public void onCompletion(ServiceProxyException e) {
                    if (e != null) {
                        removeAllStoredCollections();
                        try {
                            JSONObject response = new JSONObject();
                            response.put("success",true);
                            promise.resolve( SyncUtil.convertJsonToMap(response));
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                            promise.reject("LOGOUT_FAILED",e1.getMessage());
                        }
                    }
                }
            });
        } catch (ServiceProxyException e) {
            e.printStackTrace();
            promise.reject("LOGOUT_FAILED",e.getMessage());
        }
    }

    @ReactMethod
    public void invokeCustomAPI(ReadableMap objectJSON, String apiName, String endPoint, final Promise promise) {
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        String url = sync.getMobileBackend().getUrl() + "/mobile/custom/" + apiName + "/" + endPoint;
        try {
            Log.d(TAG, "invokeCustomAPI:" + SyncUtil.convertMapToJson(objectJSON).toString());
            sync.requestWithUri(url, RequestMethod.POST, null, null, SyncUtil.convertMapToJson(objectJSON).toString().getBytes(), new SynchronizationCallback() {
                @Override
                public void onComplete(int i, Map<String, String> map, InputStream inputStream) {
                    try {
                        JSONObject jsonObject = new JSONObject(IOUtils.toString(inputStream));
                        promise.resolve(SyncUtil.convertJsonToMap(jsonObject));
                    } catch (JSONException e) {
                        e.printStackTrace();
                        promise.reject("CUSTOM_API_FAILED",e);
                    }
                }

                @Override
                public void onError(int i, Map<String, String> map, String s) {
                    promise.reject("CUSTOM_API_FAILED",s);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject("CUSTOM_API_FAILED",e.getMessage());
        }
    }

    @ReactMethod
    public void deleteObject(final String idValue,String diffrentiator, final String apiName, final String endPoint, final Promise promise) {
        findObject(apiName, endPoint, diffrentiator, idValue, new FindObjectCallback() {
            @Override
            public void onFindObject(List<MobileObject> objects) {
                if (objects != null && objects.size() > 0) {
                    MobileObject mobileObject = objects.get(0);
                    mobileObject.deleteResource(new MobileEndpointCallback() {
                        @Override
                        public void onComplete(Exception e, MobileResource mobileResource) {

                        }
                    });
                    WritableNativeMap newMap = new WritableNativeMap();
                    newMap.putString("id",idValue);
                    promise.resolve(newMap);
                }else{
                    promise.reject("OBJECT_DELETION_FAILED","object not found");
                }
            }
        });
    }

    @ReactMethod
    public void createNewObject(final ReadableMap objectJSON, final String apiName, final String endPoint, String diffrentiator, final String isPinHigh, final Promise promise) {
        if(objectJSON.hasKey(diffrentiator) && objectJSON.getString(diffrentiator).isEmpty() == false){
            findObject(apiName, endPoint, diffrentiator, objectJSON.getString(diffrentiator), new FindObjectCallback() {
                @Override
                public void onFindObject(List<MobileObject> objects) {
                    if (objects != null && objects.size() > 0) {
                        //Edit existing object.
                        MobileObject mobileObject = objects.get(0);
                        saveObject(objectJSON,mobileObject,apiName,endPoint,isPinHigh,promise);
                    }else{
                        //Save a new object.
                        initiateNewObject(objectJSON,apiName,endPoint,isPinHigh,promise);
                    }
                }
            });
        }else{
            //Save a new object.
            initiateNewObject(objectJSON,apiName,endPoint,isPinHigh,promise);
        }
    }

    public void initiateNewObject(ReadableMap objectJSON, String apiName, String endPoint, String isPinHigh, final Promise promise){
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        MobileObject mobileObject = mobileEndpoint.createObject();
        saveObject(objectJSON,mobileObject,apiName,endPoint,isPinHigh,promise);
    }

    public void saveObject(ReadableMap objectJSON, MobileObject mobileObject, final String apiName, final String endPoint, String isPinHigh, final Promise promise){

        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        SyncPolicy policy = mobileObject.getCurrentSyncPolicy();
        policy.setUpdatePolicy(UPDATE_POLICY_QUEUE_IF_OFFLINE);
        mobileObject.setSyncPolicy(policy);

        WritableNativeMap newValues = new WritableNativeMap();




        try {

            WritableMap oldValues = SyncUtil.convertJsonToMap(mobileObject.getJsonObject());
            newValues.merge(oldValues);
            newValues.merge(objectJSON);
            newValues.putString("CurrencyCode",getCurrencyCode());

            mobileObject.initialize(mobileObject.getSyncResource(),mobileEndpoint,SyncUtil.convertMapToJson(newValues));
            mobileObject.saveResource(new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    if (e != null) {
                        promise.reject("OBJECT_CREATION_FAILED","Error while inserting record");
                    }else{
                        try {
                            MobileObject newObject = (MobileObject)mobileResource;
                            JSONObject response = new JSONObject();
                            response.put("success",true);
                            response.put("object",newObject.getJsonObject());
                            promise.resolve( SyncUtil.convertJsonToMap(response));
                        } catch (JSONException e1) {
                            e1.printStackTrace();
                            promise.reject("OBJECT_CREATION_FAILED","Error while inserting record");
                        }
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            promise.reject("OBJECT_CREATION_FAILED","Error while inserting record");
        }
    }

    public void findObject(String apiName, String endPoint, final String key, final String value, final FindObjectCallback callback){
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        FetchCollectionBuilder builder = mobileEndpoint.fetchObjects();
        SyncPolicy policy = builder.getPolicy();
        policy.setFetchPolicy(SyncPolicy.FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY);
        try{
            builder.withPolicy(policy).execute(new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    try{
                        MobileObjectCollection collection = (MobileObjectCollection) mobileResource;
                        List<MobileObject> objects = collection.getObjectsList();
                        List<MobileObject> filteredObjects = new ArrayList<>();
                        for (MobileObject object:objects
                             ) {
                            if (object.getJsonObject().has(key) && object.getJsonObject().getString(key).equals(value)){
                                filteredObjects.add(object);
                            }
                        }
                        callback.onFindObject(filteredObjects);
                    }catch(Exception ex){
                        callback.onFindObject(null);
                    }
                }
            });
        }catch (Exception e){
            callback.onFindObject(null);
        }
    }

    @ReactMethod
    public void hasLocalRecords(final Promise promise) {
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();

        sync.loadOfflineResources(new SyncLocalLoadingCallback() {
            @Override
            public void onSuccess(List<MobileResource> list) {
                try {
                    JSONObject response = new JSONObject();
                    response.put("LocalCounts",list.size() > 0);
                    //TODO add failed count once offline resource sync method is implemented.
                    response.put("FailedCounts",true);
                    promise.resolve( SyncUtil.convertJsonToMap(response));
                } catch (JSONException e) {
                    e.printStackTrace();
                    promise.reject("HAS_LOCAL_DATA_FAILED",e);
                }
            }

            @Override
            public void onError(String s) {
                promise.reject("HAS_LOCAL_DATA_FAILED",s);
            }
        });
    }

    @ReactMethod
    public void eraseLocalDatabase(final Promise promise) {
        try {
            Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
            sync.purge();
            removeAllStoredCollections();
            promise.resolve(true);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject("ERASE_LOCAL_DATABASE_FAILED",e);
        } catch (InterruptedException e) {
            e.printStackTrace();
            promise.reject("ERASE_LOCAL_DATABASE_FAILED",e);
        }
    }

    @ReactMethod
    public void removeAllStoredCollections(){
        ReactApplicationContext context = getReactApplicationContext();
        SharedPreferences preferences = context.getSharedPreferences(kAppPref, Context.MODE_PRIVATE);
        preferences.edit().clear().commit();
    }

    @ReactMethod
    public void fetchFile(String apiName, String endPoint, final Promise promise) {

        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

        FetchCollectionBuilder builder = mobileEndpoint.fetchObjects();
        SyncPolicy policy = builder.getPolicy();
        policy.setFetchPolicy(SyncPolicy.FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY);
        try{
            builder.withPolicy(policy).execute(new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    try{
                        MobileObjectCollection collection = (MobileObjectCollection) mobileResource;
                        List<MobileObject> objects = collection.getObjectsList();
                        JSONArray pathArray = new JSONArray();
                        for (MobileObject mobileObject:objects
                                ) {
                            //Save the resource to local file system and send filePath to React Native Bridge.
                            Uri path = saveFileToDirectory(mobileObject);
                            pathArray.put(path);
                        }
                        promise.resolve(SyncUtil.convertJsonToArray(pathArray));
                    }catch(Exception ex){
                        promise.reject("FILE_FETCH_FAILED",ex);
                    }
                }
            });
        }catch (Exception e){
            promise.reject("OBJECT_FETCH_FAILED",e);
        }
    }

    private Uri saveFileToDirectory(MobileObject mobileObject) throws Exception {
        try {
            JSONObject jsonObject = mobileObject.getJsonObject();
            String base64FileContent = jsonObject.getString("FileContents");
            String AttachedDocumentId = jsonObject.getString("AttachedDocumentId");
            String fileName = AttachedDocumentId + "_" + jsonObject.getString("FileName");

            ReactApplicationContext context = getReactApplicationContext();

            File file = new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES),fileName);
            FileOutputStream os = new FileOutputStream(file);
            os.write(Base64.decode(base64FileContent,Base64.NO_WRAP));
            os.flush();
            os.close();

            Log.d(TAG, "saveFileToDirectory: " + file.getPath());

            return Uri.fromFile(file);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


    private boolean createDirIfNotExists(String path) {
        boolean ret = true;
        ReactApplicationContext context = getReactApplicationContext();
        File file = new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES), path);
        if (!file.exists()) {
            if (!file.mkdirs()) {
                ret = false;
            }
        }
        return ret;
    }

    private void copyFile(File src, File dst) throws IOException {
        FileInputStream inStream = new FileInputStream(src);
        FileOutputStream outStream = new FileOutputStream(dst);
        FileChannel inChannel = inStream.getChannel();
        FileChannel outChannel = outStream.getChannel();
        inChannel.transferTo(0, inChannel.size(), outChannel);
        inStream.close();
        outStream.close();
    }

    @ReactMethod
    public void createNewFile(String fileName, String fileType, String filePath, String apiName, String endPoint, final Promise promise) {

        ReactApplicationContext context = getReactApplicationContext();
        String newFilePath = filePath.replaceAll("file://","");
        File file = new File(newFilePath);

        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();

        if (file.exists() && file.length() > 0) {
            int size = (int) file.length();
            byte[] bytes = new byte[size];
            try {
                BufferedInputStream buf = new BufferedInputStream(new FileInputStream(file));
                buf.read(bytes, 0, bytes.length);
                buf.close();
                
                String base64Image = Base64.encodeToString(bytes, Base64.NO_WRAP);

                //Check if we have the network connectivity otherwise save the file to local directory and upload after the connectivity is back and we got Sales cloud generated Ids to upload attachments.
                if(sync.getNetworkStatus() != SyncNetworkStatus.SyncOnline && endPoint.contains("ORACO__InvoiceDSD_c") && endPoint.contains("Invoice-")){
                    String mobileUID = endPoint.replace("ORACO__InvoiceDSD_c","").replace("UploadAttachment","");
                    if(createDirIfNotExists(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES) + "/" + mobileUID)){
                        File offlineFile = new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES) + "/" + mobileUID,fileName);
                        try {
                            copyFile(file,offlineFile);
                            JSONObject response = new JSONObject();
                            response.put("success",true);
                            promise.resolve( SyncUtil.convertJsonToMap(response));
                            return;
                        } catch (Exception e) {
                            e.printStackTrace();
                            promise.reject("FILE_FETCH_FAILED",e);
                            return;
                        }
                    }
                }else{
                    //Network is online and we will upload the file.
                    WritableNativeMap newValues = new WritableNativeMap();
                    newValues.putString("DatatypeCode","FILE");
                    newValues.putString("FileContents",base64Image);
                    newValues.putString("UploadedFileContentType",fileType);
                    newValues.putString("UploadedFileName",fileName);

                    final MobileEndpoint mobileEndpoint = sync.openMobileEndpoint(apiName,endPoint,MobileObject.class);

                    MobileObject mobileObject = mobileEndpoint.createObject();

                    SyncPolicy policy = mobileObject.getCurrentSyncPolicy();
                    policy.setUpdatePolicy(UPDATE_POLICY_QUEUE_IF_OFFLINE);
                    mobileObject.setSyncPolicy(policy);

                    try {
                        mobileObject.initialize(mobileObject.getSyncResource(),mobileEndpoint,SyncUtil.convertMapToJson(newValues));
                        mobileObject.saveResource(new MobileEndpointCallback() {
                            @Override
                            public void onComplete(Exception e, MobileResource mobileResource) {
                                if (e != null) {
                                    promise.reject("OBJECT_CREATION_FAILED","Error while inserting record");
                                }else{
                                    try {
                                        MobileObject newObject = (MobileObject)mobileResource;
                                        JSONObject response = new JSONObject();
                                        response.put("success",true);
                                        response.put("object",newObject.getJsonObject());
                                        promise.resolve( SyncUtil.convertJsonToMap(response));
                                    } catch (JSONException e1) {
                                        e1.printStackTrace();
                                        promise.reject("FILE_CREATION_FAILED","Error while uploading file");
                                    }
                                }
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                        promise.reject("FILE_CREATION_FAILED","Error while uploading file");
                    }
                }
            } catch (FileNotFoundException e) {
                promise.reject("FILE_CREATION_FAILED","Error while uploading file");
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                promise.reject("FILE_CREATION_FAILED","Error while uploading file");
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }else{
            promise.reject("FILE_CREATION_FAILED","File does not exist");
        }
    }

    private void setOfflineResourceUploadingListerner(){
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        sync.offlineResourceSynchronized(new SyncResourceUpdatedCallback() {
            @Override
            public void onResourceUpdated(String s, MobileResource mobileResource) {
                if (s == null) {
                    Log.d(TAG, "onResourceUpdated: " + s + "Resource deleted");
                }else{
                    if (mobileResource.getSyncResource().getResourceType() == ResourceType.COLLECTION){
                        MobileObjectCollection collection = (MobileObjectCollection) mobileResource;
                        List<MobileObject> objects = collection.getObjectsList();
                        JSONArray jsonArray = new JSONArray();
                        for (MobileObject mobileObject:objects
                                ) {
                            SyncPriority priority = SyncPriority.fromValue(s);
                            if(mobileObject.hasOfflineUpdates()){
                                final MobileObjectPriority topObject = new MobileObjectPriority();
                                topObject.mobileObject = mobileObject;
                                topObject.priority = priority;
                                topObject.getObjectCopy(new MobileObjectPriority.MobileObjectPriorityCallback() {
                                    @Override
                                    public void onCopyObject(final MobileObject object) {
                                        if (object != null) {
                                            object.saveResource(new MobileEndpointCallback() {
                                                @Override
                                                public void onComplete(Exception e, MobileResource mobileResource) {
                                                    if (mobileResource == null) {
                                                        syncFailedMobileObjects.add(topObject);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }else{
                                //Append server generated ID to children.
                                //TODO populate child ids and invoices.
                                //mobileObject.populateChildsWithIds()
                                if (priority == SyncPriority.invoice){
                                    checkForExistingInvoice(mobileObject);
                                }
                            }
                        }
                    }else if(mobileResource.getSyncResource().getResourceType() == ResourceType.ITEM){
                        MobileObject mobileObject = (MobileObject) mobileResource;
                        SyncPriority priority = SyncPriority.fromValue(s);
                        //TODO populate child ids and invoices.
                        //mobileObject.populateChildsWithIds()
                        if (priority == SyncPriority.invoice){
                            checkForExistingInvoice(mobileObject);
                        }
                    }else{
                        //Sync resource type is file.
                    }
                }
            }
        });
    }

    @ReactMethod
    public void uploadOfflineResourcesToServer(final Promise promise) {
        MCSSyncManager.getManager().getMcsSynchronization().setOfflineMode(false);
        syncNext(new SyncFailCompletionCallback() {
            @Override
            public void onFinish(Boolean status) {
                promise.resolve(true);
            }
        });
    }

    private void syncNext(final SyncFailCompletionCallback callback){
        if(syncFailedMobileObjects.size() > 0){
            final MobileObjectPriority topObject = syncFailedMobileObjects.first();
            topObject.getObjectCopy(new MobileObjectPriority.MobileObjectPriorityCallback() {
                @Override
                public void onCopyObject(final MobileObject object) {
                    if (object == null) {
                        syncFailedMobileObjects.remove(topObject);
                        syncNext(callback);
                    }else{
                        object.saveResource(new MobileEndpointCallback() {
                            @Override
                            public void onComplete(Exception e, MobileResource mobileResource) {
                                if (e != null) {
                                    syncFailedMobileObjects.remove(topObject);
                                    syncNext(callback);
                                }else{
                                    if(topObject.priority == SyncPriority.invoice){
                                        checkForExistingInvoice((MobileObject) mobileResource);
                                    }
                                    syncFailedMobileObjects.remove(topObject);
                                    syncNext(callback);
                                }
                            }
                        });
                    }
                }
            });
        }else {
            callback.onFinish(true);
        }
    }

    //TODO Implement the logic for below method.
    private void checkForExistingInvoice(MobileObject mobileObject){

    }
}

enum SyncPriority {
    order(1),
    orderLine(2),
    invoice(3),
    invoiceLine(4),
    payment(5),
    paymentLine(6),
    other(7);

    private int value;

    private SyncPriority(int value) {
        this.value = value;
    }

    public static SyncPriority fromValue(String uri) {
        if(uri.contains("CustomOrder_c")){
            return order;
        }else if(uri.contains("CustomOrderLine_c")){
            return orderLine;
        }
        else if(uri.contains("ORACO__InvoiceDSD_c")){
            return invoice;
        }
        else if(uri.contains("ORACO__InvoiceLineDSD_c")){
            return invoiceLine;
        }
        else if(uri.contains("ORACO__PaymentDSD_c")){
            return payment;
        }
        else if(uri.contains("ORACO__PaymentLineDSD_c")){
            return paymentLine;
        }else{
            return other;
        }
    }

    public int getValue() {
        return this.value;
    }

    public String getEndpoint(){
        switch (this){
            case order:
                return "CustomOrder_c";
            case orderLine:
                return "CustomOrderLine_c";
            case invoice:
                return "ORACO__InvoiceDSD_c";
            case invoiceLine:
                return "ORACO__InvoiceLineDSD_c";
            case payment:
                return "ORACO__PaymentDSD_c";
            case paymentLine:
                return "ORACO__PaymentLineDSD_c";
            case other:
                return "";
        }
        return "";
    }

    public MobileEndpoint getMobileEndpoint(){
        Synchronization sync = MCSSyncManager.getManager().getMcsSynchronization();
        String endPoint = this.getEndpoint();
        MobileEndpoint mobileEndpoint = sync.openMobileEndpoint("JTI_SALESPOC",endPoint,MobileObject.class);
        return mobileEndpoint;
    }
}

class MobileObjectPriority{
    MobileObject mobileObject;
    SyncPriority priority;

    interface MobileObjectPriorityCallback {
        void onCopyObject(MobileObject object);
    }

    public void getObjectCopy(final MobileObjectPriorityCallback callback){
        try {
            mobileObject.reloadResource(false, false, new MobileEndpointCallback() {
                @Override
                public void onComplete(Exception e, MobileResource mobileResource) {
                    try {
                        MobileObject object = (MobileObject) mobileResource;
                        if(priority != SyncPriority.other){
                            MobileObject copiedObject = priority.getMobileEndpoint().createObject();
                            WritableMap map = SyncUtil.convertJsonToMap(object.getJsonObject());
                            copiedObject.populateProperties(map.toHashMap());
                            mobileObject.reloadResource(true, false, new MobileEndpointCallback() {
                                @Override
                                public void onComplete(Exception e, MobileResource mobileResource) {

                                }
                            });
                            callback.onCopyObject(copiedObject);
                        }else{
                            callback.onCopyObject(null);
                        }
                    } catch (JSONException e1) {
                        e1.printStackTrace();
                        callback.onCopyObject(null);
                    } catch (Exception e1) {
                        e1.printStackTrace();
                        callback.onCopyObject(null);
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            callback.onCopyObject(null);
        }
    }
}

class SortByPriorityMobileObject implements Comparator<MobileObjectPriority>{
    @Override
    public int compare(MobileObjectPriority mobileObjectPriority, MobileObjectPriority t1) {
        return mobileObjectPriority.priority.compareTo(t1.priority);
    }
}
