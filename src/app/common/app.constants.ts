export class AppConstants {
    private static API_BASE_URL = "http://localhost:8080/";
    private static OAUTH2_URL = AppConstants.API_BASE_URL + "oauth2/authorization/";
    private static REDIRECT_URL = "?redirect_uri=http://localhost:8100/login";
    public static API_URL = AppConstants.API_BASE_URL + "api/";
    public static AUTH_API = AppConstants.API_URL + "auth/";
    public static GOOGLE_AUTH_URL = AppConstants.OAUTH2_URL + "google" + AppConstants.REDIRECT_URL;
    public static FACEBOOK_AUTH_URL = AppConstants.OAUTH2_URL + "facebook" + AppConstants.REDIRECT_URL;
    public static ACTIVE = AppConstants.API_URL + 'active/';
    public static LOGOUT = AppConstants.AUTH_API + 'logout/';
    public static WEBSOCKET_URL = AppConstants.API_BASE_URL + 'chat';
    public static CHAT_ROOM_BY_USER = AppConstants.API_URL + 'chatroom/user';
    public static CHAT_ROOM_BY_USERS = AppConstants.API_URL + 'chatroom/rooms';
    public static CREATE_CHAT_ROOM = AppConstants.API_URL + 'chatroom';
    public static CHATS = AppConstants.CREATE_CHAT_ROOM + '/chats/';
    public static AUDIO_URL = 'http://www.pacdv.com/sounds/mechanical_sound_effects/cling_1.wav';
}