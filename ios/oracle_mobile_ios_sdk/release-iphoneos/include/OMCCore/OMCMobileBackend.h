    //
    //  OMCMobileBackend.h
    //  OMCCore
    //
    //  Copyright (c) 2015, Oracle Corp. All rights reserved.
    //

#import <Foundation/Foundation.h>
#import "OMCCore.h"
@class OMCMobileBackendManager;
@class OMCDiagnostics;
@class OMCAuthorization;
@class OMCServiceProxy;
@class OMCCustomCodeClient;
@class OMCAppConfig;

NS_ASSUME_NONNULL_BEGIN

/**
 A mobile backend object holds the settings that allow a service proxy
 to communicate with an MCS mobile backend.
 */
@interface OMCMobileBackend : NSObject

/**
 The mobile backend's manager.
 */
@property (readonly, nonatomic) OMCMobileBackendManager* manager;

/**
 The mobile backend's name.
 */
@property (readonly, nonatomic) NSString* name;

/**
 The mobile backend's application key, which is generated by the MCS
 portal, specified in the OMC
 property list file (`OMC.plist`), and passed as an HTTP header in every
 HTTP call to the MCS server.
 */
@property (readonly, nonatomic) NSString* applicationKey;

/**
 The mobile backend's application configuration.
 The application configuration will be empty until it is loaded.
 @see -[OMCMobileBackend appConfigWithCompletionHandler:]
 */
@property (readonly) OMCAppConfig* appConfig;

/**
 The mobile backend's base URL, upon which requests such as HTTP URLs are
 built. Typically, this URL is set via the OMC property list file (`OMC.plist`)
 and is in the form `http://<host>:<port>`.
 */
@property (copy) NSURL* baseURL;

/**
 The mobile backend's path, which is appended to the `baseURL` to
 form the `url`. The default mobile backend path is `OMCMobileBackendPathDefault`.
 */
@property (copy) NSString* path;

/**
 The mobile backend's URL, upon which requests such as HTTP URLs are
 built. This URL is built by appending the current `path`
 to the current `baseURL`.
 */
@property (readonly) NSURL* url;

/**
 The mobile backend's platform path, which is appended to the `url` to
 form the `platformURL`. The default platform path is `OMCMobileBackendPlatformPathDefault`.
 */
@property (copy) NSString* platformPath;

/**
 The mobile backend's platform URL, upon which requests such as HTTP URLs are
 built. This URL is built by appending the current `platformPath`
 to the current `url`.
 */
@property (readonly) NSURL* platformURL;

/**
 The mobile backend's application configuration path, which is appended to the `platformURL` to
 form the `appConfigURL`. The default application configuration path is `OMCMobileBackendAppConfigPathDefault`.
 */
@property (copy) NSString* appConfigPath;

/**
 The mobile backend's application configuration URL, upon which requests such as HTTP URLs are
 built. This URL is built by appending the current `appConfigPath`
 to the current `platformURL`.
 */
@property (readonly) NSURL* appConfigURL;

/**
 The mobile backend's custom API path, which is appended to the `url` to
 form the `customCodeURL`. The default custom API path is `OMCMobileBackendCustomCodePathDefault`.
 */
@property (copy) NSString* customCodePath;

/**
 The mobile backend's custom API URL, upon which requests such as HTTP URLs are
 built. This URL is built by appending the current `customCodePath`
 to the current `url`.
 */
@property (readonly) NSURL* customCodeURL;

/**
 The mobile backend's diagnostics.
 */
@property (readonly, nonatomic) OMCDiagnostics* diagnostics;

/**
 The mobile backend's authorization.
 */
@property (readonly, nonatomic) OMCAuthorization* authorization;

/**
 The mobile backend's custom code client.
 */
@property (readonly, nonatomic) OMCCustomCodeClient* customCodeClient;

/**
 The mobile backend's properties, as specified by the OMC property list file
 (`OMC.plist`).
 */
@property (readonly, nonatomic) NSDictionary<NSString*, id>* properties;


#pragma mark - Service proxies

/**
 Returns the receiver's instance of the specified service proxy, if present.
 If the specified service proxy is not present, creates it via reflection and
 returns the new instance.
 @param serviceProxyClass The type of service proxy.
 @warning Raises an `NSInvalidArgumentException` if `serviceProxyClass` is `nil`.
 */
- (nullable OMCServiceProxy*)serviceProxyForClass:(Class)serviceProxyClass;

/**
 Removes the specified service proxy from the receiver.
 
 Does nothing if the receiver does not contain `serviceProxy`.
 @param serviceProxy The service proxy.
 @warning Raises an `NSInvalidArgumentException` if `serviceProxy` is `nil`.
 */
- (void)removeServiceProxy:(OMCServiceProxy*)serviceProxy;

/**
 Removes the receiver's instance of the specified service proxy.
 
 Does nothing if the receiver does not contain the specified service proxy.
 @param serviceProxyClass The type of service proxy.
 @warning Raises an `NSInvalidArgumentException` if `serviceProxyClass` is `nil`.
 */
- (void)removeServiceProxyForClass:(Class)serviceProxyClass;


#pragma mark - App Config

/**
 Completion handler used when loading a mobile backend's application configuration.
 @see -[OMCMobileBackend appConfigWithCompletionHandler:]
 */
typedef void (^OMCAppConfigCompletionBlock)(OMCAppConfig* _Nullable appConfig, NSError* _Nullable error);

/**
 Loads the receiver's application configuration asynchronously.
 @param completionHandler The completion block invoked when the application configuration
 is loaded or an error occurs.
 */
- (void)appConfigWithCompletionHandler:(OMCAppConfigCompletionBlock)completionHandler;


#pragma mark - URL Requests

/**
 Completion handler used when building a URL request that may require a network
 call (e.g. to retrieve an authorization token).
 */
typedef void (^OMCURLRequestCompletionBlock)(NSMutableURLRequest* _Nullable urlRequest, NSError* _Nullable error);

/**
 Returns a URL request configured with a URL with the specified path,
 relative to the mobile backend's URL.
 
 The request will be configured with the appropriate MCS HTTP headers:
 
 - application key
 - diagnostics device ID
 - diagnostics session ID
 - diagnostics timestamp
 - authorization
 
 @param relativePath The return request's URL path, relative to the mobile backend's URL.
 @see url
 @see urlRequestWithPath:completionHandler:
 */
- (NSMutableURLRequest*)urlRequestWithPath:(nullable NSString*)relativePath;

/**
 Builds a URL request configured with a URL with the specified path,
 relative to the mobile backend's URL.
 
 @param relativePath The return request's URL path, relative to the mobile backend's URL.
 @param completionHandler The completion block invoked when the URL request
 is built or an error occurs.
 @see urlRequestWithPath:
 */
- (void)urlRequestWithPath:(nullable NSString*)relativePath
         completionHandler:(OMCURLRequestCompletionBlock)completionHandler;

/**
 Returns a URL request configured with a URL with the specified path,
 relative to the mobile backend's platform URL.
 
 The request will be configured with the appropriate MCS HTTP headers:
 
 - application key
 - diagnostics device ID
 - diagnostics session ID
 - diagnostics timestamp
 - authorization
 
 @param relativePath The return request's URL path, relative to the mobile backend's platform URL.
 @see platformURL
 @see platformURLRequestWithPath:completionHandler:
 */
- (NSMutableURLRequest*)platformURLRequestWithPath:(nullable NSString*)relativePath;

/**
 Builds a URL request configured with a URL with the specified path,
 relative to the mobile backend's platform URL.
 
 @param relativePath The return request's URL path, relative to the mobile backend's platform URL.
 @param completionHandler The completion block invoked when the URL request
 is built or an error occurs.
 @see platformURLRequestWithPath:
 */
- (void)platformURLRequestWithPath:(nullable NSString*)relativePath
                 completionHandler:(OMCURLRequestCompletionBlock)completionHandler;

/**
 Returns a URL request configured with a URL with the specified path,
 relative to the mobile backend's custom code URL.
 
 The request will be configured with the appropriate MCS HTTP headers:
 
 - application key
 - diagnostics device ID
 - diagnostics session ID
 - diagnostics timestamp
 - authorization
 - analytics session ID
 
 @param relativePath The return request's URL path, relative to the mobile backend's custom code URL.
 @see customCodeURL
 @see customCodeURLRequestWithPath:completionHandler:
 */
- (NSMutableURLRequest*)customCodeURLRequestWithPath:(nullable NSString*)relativePath;

/**
 Builds a URL request configured with a URL with the specified path,
 relative to the mobile backend's custom code URL.
 
 @param relativePath The return request's URL path, relative to the mobile backend's custom code URL.
 @param completionHandler The completion block invoked when the URL request
 is built or an error occurs.
 @see customCodeURLRequestWithPath:
 */
- (void)customCodeURLRequestWithPath:(nullable NSString*)relativePath
                   completionHandler:(OMCURLRequestCompletionBlock)completionHandler;

/**
 Returns an HTTP URL `GET` request configured with a URL with the specified path,
 relative to the mobile backend's application configuration URL.
 
 The request will be configured with the appropriate MCS HTTP headers:
 
 - application key
 - diagnostics device ID
 - diagnostics session ID
 - diagnostics timestamp
 - anonymous authorization
 - gzip JSON accept encoding
 
 @param relativePath The return request's URL path, relative to the mobile backend's application configuration URL.
 @see appConfigURL
 @see appConfigURLRequestWithPath:completionHandler:
 */
- (NSMutableURLRequest*)appConfigURLRequestWithPath:(nullable NSString*)relativePath;

/**
 Builds an HTTP URL `GET` request configured with a URL with the specified path,
 relative to the mobile backend's application configuration URL.
 
 @param relativePath The return request's URL path, relative to the mobile backend's application configuration URL.
 @param completionHandler The completion block invoked when the URL request
 is built or an error occurs.
 @see appConfigURLRequestWithPath:
 */
- (void)appConfigURLRequestWithPath:(nullable NSString*)relativePath
                  completionHandler:(OMCURLRequestCompletionBlock)completionHandler;


#pragma mark - HTTP headers

/**
 Sets the receiver's HTTP headers on the specified URL request.
 The headers will include the application key, authorization settings,
 and the diagnostics context state.  Call this method to ensure that
 all the required MCS headers are included.
 
 @param request A URL request.
 @warning Raises an `NSInvalidArgumentException` if `request` is `nil`.
 @see setHTTPHeadersOnRequest:completionHandler:
 */
- (void)setHTTPHeadersOnRequest:(NSMutableURLRequest*)request;

/**
 Sets the receiver's HTTP headers on the specified URL request.
 The headers will include the application key, authorization settings,
 and the diagnostics context state.  Call this method to ensure that
 all the required MCS headers are included.
 
 @param request A URL request.
 @param completionHandler The completion block invoked once the mobile
 backend's HTTP headers have been added to the URL request
 or an error occurs.
 @warning Raises an `NSInvalidArgumentException` if `request` is `nil`.
 @see setHTTPHeadersOnRequest:
 */
- (void)setHTTPHeadersOnRequest:(NSMutableURLRequest*)request
              completionHandler:(OMCErrorCompletionBlock)completionHandler;

@end


#pragma mark - Constants

/**
 The mobile backend `appKey` property name.
 */
extern NSString* const OMCMobileBackendAppKeyPropertyName;

/**
 The mobile backend `Oracle-Mobile-Application-Key` HTTP header field name.
 */
extern NSString* const OMCMobileBackendApplicationKeyHTTPHeaderFieldName;

/**
 The mobile backend `allowsCellularAccess` property name.
 */
extern NSString* const OMCMobileBackendAllowsCellularAccessPropertyName;

/**
 The mobile backend `allowsCellularAccess` default value (`YES`).
 */
extern BOOL const OMCMobileBackendAllowsCellularAccessDefault;

/**
 The mobile backend `networkConnectionTimeout` property name.
 */
extern NSString* const OMCMobileBackendNetworkConnectionTimeoutPropertyName;

/**
 The mobile backend `networkConnectionTimeout` default value (`60`).
 */
extern NSTimeInterval const OMCMobileBackendNetworkConnectionTimeoutDefault;

/**
 The mobile backend `baseURL` property name.
 */
extern NSString* const OMCMobileBackendBaseURLPropertyName;

/**
 The mobile backend `path` property name,
 appended to the base URL supplied in the properties file.
 */
extern NSString* const OMCMobileBackendPathPropertyName;

/**
 The default mobile backend path (`mobile`).
 */
extern NSString* const OMCMobileBackendPathDefault;

/**
 The mobile backend `platformPath` property name,
 appended to the base URL and mobile backend path supplied
 in the properties file.
 */
extern NSString* const OMCMobileBackendPlatformPathPropertyName;

/**
 The default mobile backend platform path (`platform`).
 */
extern NSString* const OMCMobileBackendPlatformPathDefault;

/**
 The mobile backend `appConfigPath` property name,
 appended to the platform URL.
 */
extern NSString* const OMCMobileBackendAppConfigPathPropertyName;

/**
 The default mobile backend application configuration path (`appconfig`).
 */
extern NSString* const OMCMobileBackendAppConfigPathDefault;

/**
 The mobile backend client application configuration path (`client`),
 appended to the mobile backend application configuration URL.
 */
extern NSString* const OMCMobileBackendClientAppConfigPath;

/**
 The value of the `code` of the `NSError` generated when
 an issue occurs requesting the app config.
 See the values in the `userInfo` dictionary.
 */
extern NSInteger const OMCMobileBackendGetAppConfigError;

/**
 The mobile backend `customCodePath` property name,
 appended to the base URL and mobile backend path supplied
 in the properties file.
 */
extern NSString* const OMCMobileBackendCustomCodePathPropertyName;

/**
 The default mobile backend custom code path (`custom`).
 */
extern NSString* const OMCMobileBackendCustomCodePathDefault;

/**
 The mobile backend `authorization` property name.
 */
extern NSString* const OMCMobileBackendAuthorizationPropertyName;

/**
 A key to the `userInfo` dictionary in
 the `NSError` generated when an HTTP call generates an unexpected response.
 The corresponding value is the `NSURLRequest` that generated the error.
 */
extern NSString* const OMCMobileBackendErrorRequest;

/**
 A key to the `userInfo` dictionary in
 the `NSError` generated when an HTTP call generates an unexpected response.
 The corresponding value is the `NSHTTPURLResponse` returned by the HTTP call.
 */
extern NSString* const OMCMobileBackendErrorResponse;

/**
 A key to the `userInfo` dictionary in
 the `NSError` generated when an HTTP call generates an unexpected response.
 The corresponding value is the `NSData` returned by the HTTP call.
 */
extern NSString* const OMCMobileBackendErrorResponseData;

/**
 A key to the `userInfo` dictionary in
 the `NSError` generated when an unexpected error is encountered.
 The corresponding value is the `NSError` encountered.
 */
extern NSString* const OMCMobileBackendErrorCause;

/**
 The Mobile Client SDK Info header field name (`"Oracle-Mobile-Client-SDK-Info"`).
 */
extern NSString* const OMCMobileClientSDKInfoHTTPHeaderFieldName;

NS_ASSUME_NONNULL_END
