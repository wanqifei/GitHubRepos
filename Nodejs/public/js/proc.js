function retrieveData() {
    console.log("retrieveing Data");
    try {
        var xhr = new XMLHttpRequest();
    } catch (err) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (xhr == null) {
        alert('Ajax is not supported by your browser!')
        return;
    }
    var rurl = 'lib/sqllib.js?ID=*';

    xhr.onreadystatechange = handler;
    xhr.open('GET', rurl, true);
    xhr.send(null);

    function handler() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                document.getElementById('timeLogTb').innerHTML = xhr.responseText;
            } else {
                alert('Error with Ajax call!');
            }
        }
    }

}