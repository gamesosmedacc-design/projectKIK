const contraints = {
    video: {
        facingMode: 'user',
        width: { ideal: 720},
        height: {ideal: 420}
    }
}

navigator.mediaDevices.getUserMedia(contraints)
    .then((stream) => {
        document.getElementById("cam").srcObject = stream;
    })