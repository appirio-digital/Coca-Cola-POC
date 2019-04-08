/* Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *****************************************************************************/

package com.jtisales;

import java.io.IOException;
import java.util.UUID;

import oracle.cloud.mobile.authorization.AuthorizationAgent;
import oracle.cloud.mobile.logger.Logger;
import oracle.cloud.mobile.mobilebackend.MobileBackend;
import oracle.cloud.mobile.sync.Synchronization;

public class MCSSyncManager {

    public static final String TAG = MCSSyncManager.class.getSimpleName();

    public static MCSSyncManager mcsSyncManager;
    private AuthorizationAgent authorizationAgent;
    private Synchronization sync;
    private MobileBackend mobileBackend;
    private String sessionID = null;


    public void setMobileBackend(MobileBackend mobileBackend1){
        this.mobileBackend = mobileBackend1;
    }

    public void setAuthorizationAgent(AuthorizationAgent authorizationAgent) {
        this.authorizationAgent = authorizationAgent;
    }

    public String getSessionID() {

        if(sessionID == null){
            sessionID = UUID.randomUUID().toString();
        }

        return sessionID;
    }

    public synchronized static MCSSyncManager getManager() {
        if (mcsSyncManager == null) {
            mcsSyncManager = new MCSSyncManager();
        }

        return mcsSyncManager;
    }


    public Synchronization getMcsSynchronization(){

        if(sync != null){
            return  sync;
        }
        if(sync == null && this.authorizationAgent.isAuthorized()){
                sync = mobileBackend.getServiceProxy(Synchronization.class);
                sync.cacheHitCount();
                return sync;
        }

        return null;
    }

    public void doPurge(){
        if(sync != null ) {
            try {
                Logger.error(TAG, "starting purge");
                sync.purge();
            } catch (InterruptedException ex) {
                Logger.error(TAG, "getMcsSynchronization: " + ex.getMessage());
            } catch (IOException ex) {
                Logger.error(TAG, "getMcsSynchronization: " + ex.getMessage());
            }
            finally {
                Logger.error(TAG, "purge finished.");
            }
        }
    }
}
