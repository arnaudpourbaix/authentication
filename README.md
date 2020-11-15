# Authentication

Full authentication (Google OAuth2) system for NestJs - Angular application.

In summary, it provides:
- Login system along with user creation (persistence on a sqlite database)
- Google OAuth2 is used to create a user
- JWT to handle authentication token
- Guards for controllers and routes
- Interceptors to add JWT header and redirect to login on 401 requests
- Basic user account component
- Persisting client-side authentication with NGXS local storage plugin