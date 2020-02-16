// Converts Image in base 64
// Callback recieves base 64 image string
// Automatically interpreted by browser
function getBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}