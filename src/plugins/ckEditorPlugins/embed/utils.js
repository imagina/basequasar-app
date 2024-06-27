export const getUrlParamValue = (url, param) => {
    const newUrl = new URL(url);
    const urlParams = newUrl.searchParams;
    return encodeURI(urlParams.get(param));
};
export const isFacebookVideo = (url) => {
    return url.includes("videos") || url.includes("watch");
};
export const isFacebookPost = (url) => {
    return url.includes("post") || url.includes("photo");
};
export const getInstagramId = (url) => {
    //url has params
    let splitUrl;
    if (url.includes("?")){
        splitUrl = url.split("?")[0];
    }
    splitUrl = splitUrl ? splitUrl.split("/") : url.split("/");
    if (splitUrl[splitUrl.length - 1] === '') {
        splitUrl.pop();
    }
    return splitUrl.pop();
};

export const availableUrls = {
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
    instagram: "https://www.instagram.com/",
    facebookWatch: 'https://fb.watch/',
    twitter: "https://twitter.com/",
};