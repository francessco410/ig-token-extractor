This CLI tool will help you to extract Instagram's [Long-Lived Access Token](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens) just in few commands.

Usage:

```
> npm i -g ig-token-extractor
> ig-token-extractor
```

1. Instagram client secret:
	
    Your Instagram App ID displayed in *App Dashboard > Products > Instagram > Basic Display*.

2. Instagram client id:
    
    Your Instagram App Secret displayed in *App Dashboard > Products > Instagram > Basic Display*.

3. Instagram app redirect URI:

    Your Valid OAuth Redirect URI displayed in *App Dashboard > Products > Instagram > Basic Display* under **Client OAuth Settings** section.
    
4. Instagram code from query param:

    After visiting generated link you should be redirected to **redirect URI** from step 3. Code will be appended as a query param.

    IMPORTANT: Note that `#_` will be appended to the end of the redirect URI, but it is not part of the code itself, so strip it out.
