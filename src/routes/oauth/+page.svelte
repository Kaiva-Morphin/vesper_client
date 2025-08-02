<script lang="ts">
    import { page } from '$app/state';
    const params = new URLSearchParams(window.location.search);
    const channel = new BroadcastChannel('oauth_channel');
    const receivedState = params.get('state');
    const expectedState = localStorage.getItem('state');
    localStorage.removeItem('state');
    let err = page.url.searchParams.get("err");
    if (err) {
        channel.postMessage({
            err: err
        });
    } else {
        if (receivedState !== expectedState) {
            channel.postMessage({
                err: "Tokens doesn't match"
            });
        } else {
            let login_token = page.url.searchParams.get("login");
            if (login_token) {
                channel.postMessage({
                    login: login_token
                });
            }
            let register_token = page.url.searchParams.get("register");
            if (register_token) {
                channel.postMessage({
                    register: register_token
                });
            }
        }
    }
    window.close();
</script>