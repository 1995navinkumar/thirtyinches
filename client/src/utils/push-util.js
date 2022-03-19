import { getApplicationServerKey, sendPushSubscription } from './api-util';


export async function checkPushSubscription() {
    var registration = await getSWRegistration();
    var subscription = await getPushSubscription();
    if (subscription == null) {
        var { applicationServerKey } = await getApplicationServerKey();
        var pushSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey
        });
        sendPushSubscription(pushSubscription).catch(err => {
            pushSubscription.unsubscribe();
        });
    } else {
        console.log("subscribed to push");
    }
}

export async function getPushSubscription() {
    var registration = await getSWRegistration();
    return registration.pushManager.getSubscription();
}

export async function unsubscribePush() {
    var registration = await getSWRegistration();
    var subscription = await registration.pushManager.getSubscription();
    return subscription.unsubscribe();
}

async function getSWRegistration() {
    return navigator.serviceWorker.getRegistration();
}