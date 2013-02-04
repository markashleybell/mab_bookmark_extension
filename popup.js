// This callback function is called when the content script has been 
// injected and returned its results
function onPageInfo(o)  { 
    document.getElementById("title").value = o.title; 
    document.getElementById("url").value = o.url; 
    document.getElementById("summary").innerText = o.summary; 
} 

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    var postUrl = "http://appurl/addbookmark";
    var xhr = new XMLHttpRequest();

    // This async request used to work, but now doesn't for some reason...
    // It works if you 'Inspect popup' and step through the code in the Chrome debugger,
    // but as soon as you close the debugger and try the same thing, the call fails?!??

    // xhr.onreadystatechange = function() { 
    //     // If the request completed, close the extension popup
    //     if (this.readyState == 4) {
    //         if (this.status == 200) 
    //             window.close();
    //     }
    // };

    // xhr.open("POST", postUrl, true);

    // Non-asynchronous request works fine
    xhr.open("POST", postUrl, false);
    
    var params = "title=" + document.getElementById("title").value + 
                 "&url=" + document.getElementById("url").value + 
                 "&summary=" + document.getElementById("summary").value +
                 "&tags=" + document.getElementById("tags").value;
    
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

    window.close();

    return false;
}

// When the popup HTML has loaded
window.addEventListener("load", function(evt) {
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Call the getPageInfo function in the background page, injecting content_script.js 
    // into the current HTML page and passing in our onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
});