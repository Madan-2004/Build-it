# middleware.py
def auth_cookie_middleware(get_response):
    """
    Middleware that reads the auth cookie and adds it to the Authorization header
    """
    def middleware(request):
        # Get the auth cookie
        auth_cookie = request.COOKIES.get('access_token')
        
        # If the cookie exists and the Authorization header isn't already set
        if auth_cookie and not request.META.get('HTTP_AUTHORIZATION'):
            # Set the Authorization header
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {auth_cookie}'
        
        response = get_response(request)
        return response
    
    return middleware