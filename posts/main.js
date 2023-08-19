const firebaseConfig = {
    apiKey: "AIzaSyCmKb5TcZ1TLrH3NbC3ADHHgQG6u9TXwVc",
    authDomain: "practice-4cdb5.firebaseapp.com",
    projectId: "practice-4cdb5",
    storageBucket: "practice-4cdb5.appspot.com",
    messagingSenderId: "566308702301",
    appId: "1:566308702301:web:f8ed2b146cc7e5faffe5b4",
    measurementId: "G-W7ERKEX4FB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function textAreaSize() {
    var textArea = document.querySelector(".post");
    textArea.style.height = "auto"; // Reset the height to auto to recalculate the size

    // Calculate the maximum height for 5 lines
    var maxHeight = parseInt(window.getComputedStyle(textArea).lineHeight) * 16;

    // Set the height to the scrollHeight, but not exceeding the maximum height
    textArea.style.height = Math.min(textArea.scrollHeight, maxHeight) + "px";
}

function createPost(event) {
    event.preventDefault();

    // get the values
    let title = document.getElementById("title");
    let post = document.getElementById("post");
    let auth = firebase.auth();
    let user = auth.currentUser;
    let userEmail = user.email;
    // const imageSrc = currentUser.photoURL
    // Get the current timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    db.collection("posts")
        .add({
            title: title.value,
            post: post.value,
            user: userEmail,
            // image: imageSrc,
            timestamp: timestamp,
        })
        .then((docRef) => {
            //console.log("Document written with ID:", docRef.id);
            Swal.fire({
                icon: "success",
                title: "Added",
                text: "Post Done",
                confirmButtonColor: "#8540f5",
                showConfirmButton: false,
                timer: 1500,
            });
            renderPostsUser();
        })
        .catch((error) => {
            //console.error("Error adding document:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could Not Post",
                confirmButtonColor: "#8540f5",
                showConfirmButton: false,
                timer: 1500,
            });
        });
    title.value = "";
    post.value = "";
}

function renderPostsUser() {
    let container = document.querySelector(".resultDash");
    container.innerHTML = "";
    db.collection("posts")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                container.innerHTML = "<h1 class='font'>No Posts Found</h1>";
            } else {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();
                    var timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
                    let post = document.createElement("div");
                    post.className += " column renderPost";

                    let row = document.createElement("div");
                    row.className += " row";
                    post.appendChild(row);

                    let image = document.createElement("img");
                    image.className += "userImg"
                    image.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFRUXGBkaGRgYGR4fHxwdHhsfHR8dHx0ZHygiHR8lGxseIzEiJiotLi8uIiIzODMsNygtLisBCgoKDg0OGxAQGy0mICYuLTAtLS0tLS0vLS0tMy8tLSsvLS8tLS0tLy0vLS0tLS0tLSstLzIwLS0tLS0vLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAIHAf/EAE4QAAIBAgQEAwQFCAcDDAMBAAECEQMhAAQSMQUiQVETYXEGMoGRFCNCobEVM1JicsHR8FNUgpKy4fEWk9IkNENjc4OUo7PD0+JkosIX/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQBAgUABv/EAEERAAECBAQCBwYDBQgDAQAAAAECEQADITEEEkFRYXEFIoGRobHwExQywdHhQlLSI1NykvEVYoKTotPi4zM0YyT/2gAMAwEAAhEDEQA/AK5w/L06pqU1QI1mpuYlSJ5dRWd+p2JbcYY8Q4YzstXSrEwWCGDqUCSYFiR5XmZjCrhecVZSoPrAdLJEkhiZMyBGq8mNyOs4J4VnyqlKXhsyFmUaYYgSL9Q225iB5YRlqlKWy3HKxBDMzdtxpVnMXmJWEnLXgb9+/Z3xUM45RDRcaXTULydTFwbEWBiew373t2VyA8AVBqKWOuVVVYFlN1W8yfehTI3OF3HvDzFKpV8FldRJcG0wJEHYSTceWJfYwvUBp6nVKVNjyrY6riZEkGTbqCTHXCuMl/sitJsSTr4XDlixrXUNF5Tk1FWiv01Wo5vqUGXdQZO4LSYiZBPzvF/foerS5aaZbwxpYWkSu5i09Ta+LH7G0xWNRtKBjcdNN5gGR+/oelyuKUKSUy9Wkoa4Olbm+mxbofwONTA4YzpinIASHdTtpte5FxUUsYz8TPEsJAcklqX17Q8Js69Sm4pajyBmBYCGYRcybgAk2O/fEQ+kqkGmzPUDAATMCJYA9TqAJ6j4nGJlK719dSg7EoVGpgWueRoZhLAdLd7DBuUqsKikl6bXDvUpGwhJiQQZCR2iZtvImz8QgpDEpZ6ioLjfql2vps1ZCJctQJFC/ZrppU+G8B5zPk0lVlJqNY8pGlOi7XFz0+fVlw45cq1IlgYEM1UWgzJVWibiNth5jEnG6SFEIEUObSykSzKQuogEwJBJnuvU4qxzapuq6iDHXReLrvIAgA+R7YKqfKnqSqanNoxOqSQbGtQSag6MLRQSFy0lMotq4rcOL+XbdjFg4ytPWmkhucA+IbEzBO4vLgxYW+BDpZOg71jJVVWGOkHWJAISBIJEm1gIwDnM74zsqg1GIgGYAJNyAYjpt6Th7wXwhTNOty8gU6bXUSdhuCQbeXbEYlczETGRQKbYNpUsRrYhju8Ew4Thk9epS+9dbOO/nCygwFXVRVyIXTJ5zsTMGCGMwN/KxlhwvMNUeVVE8OdRYASeggf5W7zgT8ootU9Ebp1iLAmDG8Qu3XvhZma5Dhkspspm5BJkXHU3mO1sEw60YVIdeaooCdNR3DYu9IpNQqeSAli1yBrRvOxI56PsxRLtK1NKsA/KssxclgINuVSOaNvTElPgdNXRyzOskMXuFJGoHmbpcE6Yk9iMDZDNhNTWd2gmRcESCRGwAC7n4kzjejWqAqzUx7pIOksI+0WknYG3w8sPLyzg4Dm7cKMCWI62tuIUSIAl5RYlhYGl6uQHSaaX4MBA3H6zGiVdtQAAQwACSQCZ6gSIj/QkU9FIoeSAeaBLQBAieYTMH+Mj3NpSrUi7SRcKohQoEnU3XWRfyn1la7ZkUlfWjqFtqUzBHQA3BAuenwOAYhaUrK1VIYguSDcVq9iwfYO1YLISfZgWDlwwDWNKNcF+ZbQQFrYaRBe8wNUAabm5gGd59bTiycJzJpqxUqdenUI2K7QTEEN0uCR6QDlF0qXqtqerZVW2gyVBNz1BGnqI6YY1s0MsdJUa92Wl7qEi4aBeL729RvloVKmrKJgcEHty7Alizg7bNroTBMQgKRQ07H3IrppB3FuLZhaBNQTSAYpedQDE6GC3CgwJkGQLWBENHwKVNqzklvefQdILaQdIF20j1gnUTOE1VkIKU2JVnQL1gFlG8QAZk+YGPOPeEuTUIQHZ4dTdjcnVItcrtHXYXwLDyEpUQUPVWahIL6kipIJGYvuTcZbrmUACms1n8dDVqcuKngOWatXdwSgEklCJXUYAWSL3gRtb0NwSg5QeHYrOohfdbaOQlYFuk7d5wDwLKNSy9B1UE1LxYH3p1A2NuW/kReYxYcjknuzagzapVbBmCyIN5MTYnue4MpxUtBzlyA4bqmg1cgt1h2jK2scqUokAGp5jelw9DyFjpHNKod84ZYBzVMNvcGx69QMWbKcSLnRXADUg0oTBDgqBBVSx+GwtO5xX/aBTSzzEWIdX3Bg2J2jrNsWfKcKGYRNIpsumSYMhoBvYkHmvMTN4icWmLKspUbh7a+izad4PBISSwsd+P2fjY8JmoVVBJc6CCpCEkqAW+yT7ogQTcSDiDLAMjeIrBQSswRNgVI1QmowZ9AYk3JXgyLr8Gq6Vl2CnkMyZIfl0genX0xNlqqVaIWoGNzzCoCisCeYyRAkapImDve1palJk9VRcOVBSgxRVmq6X/vEVBqDSAlAMwlQF2BALvqaioHB+0OYXfldf6Y/3E/jjMOfpo/8Ax/75/hjMDfCf3P5j/vwbJO4/6P8AagX2hyS07oEYlOcgxGrd4nlM6RLAfagbYG4fVHiDxmU0yCGOlWIE6ZI3MiII6X62K9pcx9armSAoV5tK36gyZAPnba15si1CpSNNHVX1DQwmSsiAJ6Sg7wQLnqAJAUyTZ66ctTamr6XYWfMHP1PPv9axB7S5uitEkmnrNJ0i0lmVgGgdWUqZI63NsBeyTVHp1zd2IFzeTEEGbbEYibRUqZzM6R9SoWmpXYrYnT0hiCLWk2HQ/wBlMgv0YMyn6xWM3H2tESOhUfdh/By0GdlQD1xlNagKBBtTqg2BO/NLFk+xUpR+HrWo4Yi+/EfYLh+a+iUDOqKlRwHEGNIAiCQZBsfhgRmfNczuEpAm7EDUwA6C4Exe/wATs6pZMNSr5Y6dNEFkGldRDAkG8TBJGrzG3Xb2cyiPkqdR1906gVIAkGLgmCO/XqZtgCsTNl//AJ5z9VeWgBuTycsGJDmxZ2ERLlyz+2lsSQ7nl2t5ecHcJ101AIB8S8heaSNQVu4Am9uvfCMZp6jqCynw6mpgAdMmTMgWKgMWkj5yAbxnjI91HamQJaxOkzEFohbnqRcYgbj1MEtraQrEFVX3jNtREMyppWJie+NfEYuSFhOHV1QXLfidiS41p+Is5rGfh8PNKSucmps9ctwzMzV00rGZysjA01RgUKbVRA0mW0IRcGxkT1PS9f4bXV6hqtpAUBdG50XBa+5Egz5G0Yl4pxJTQlRpeowO520AMSNhLAgeR6YPyvCqDU/Cd1ESfETuRzAttBXoe3nhCRJTn/Zgrc1cmijcjMd21y8bCH1HIg5zl40NL8fkeAiP2hy4VSaaBRAnlgiCxVlIvuLmNvhgeojLQVTcagwQgBiT0uQTsJMGwnVvjfM5aq7FhU1dw6+GGAIAG8km5kDTyi52xvks+fDqmpS5mYsH0ljEe6SFYi2kXgQI3NonYkTVTFmrk20rsW0Gj6lqNESZKkJQna/HnrffRhvEXD/Z7M1izFuhPMAoaOggX2JEDoe2IM1wZkWHUKzDyMbW8iOp9cOsn7ROxDFWhVCMg+0SQOYP1kiZExecFZ3LaqdOmolnMwPdUC4AY3I1A6puZGwEYAiXPCipiQ1MrXJy0rWj6OSzMKwf2iKBw7m/J67aVJp4Qu4Vl0pq4Y6menOnuDBBEwLkD8N9mGXyqCnJZzFIiAZhhNobYarbW2tOAeAkU5VteqNLIpBBIMiDEQNwLQOsYdZ/NIUX6upTV1ItJIkAWG5X5CRONRCVLw7uAkB6GvbQNU7liOUJrUlM9mJJLVAbsrWg2D9kVXL5YkIgJh21wRYksYJ9FOx74aVOVgqMHMEGFYmFAMjobss9PIAE4myns/4tJSzDlkHTJI0KGabTudvja8ImptrMOftRNxBmCDYCV62NsJS8RKUtaU1Ysct+I12YFLWZ7CHFylhAJLEhw4LXodOVd3FiQYp91nspENKgzc73vzdT02mMNKuVXweQgOxgsNiRaS03nULH52wkDsyledtIWFkAAluUG8ljMTcX2xvR9pWyoKAHWIBQ26H3umxF4na9r1KDLBRKat3IoKPYG5Gj23pFkdcgzHodLE1bUWejteCOJB6SOHAQIGABYAHa4tNzECO3Ywh4g75hT4VNvCQE6o3gAFiQLkDpvG+C6grZl1fNsQm+iWBKgSSA09PMG9oFxbMvwwGkND2F9KIQFUgiCwHvEwRPUwYscBXi/ZsZ5dqAB2c0AerOdbabQVMhJf2dHqdzcvG3AuKUjQpvTQKyqAxMsZVSDpFoJ0g2MR5m5+b46QjTA0AkEqsIGGkDfVqAkhQJIO/elcBpvRzbZcDWFJi0hT0JuOU7b9ombu8/TFSpppxpuWlYVmBkQQSWEQ0bWAi+F5iJCJZQUkpJf+6dTUkkKqmwDAXrQiBMUvNR2a1R2WYVu7nZoqvF8n/yiiWOpapFgZIGqIJEy0H599yzyFcUTUpVXKJRqFGIlXZLsh2iQQY689gYwMo1Z6jqNlAqHqBM1LX81H8yW3E6Qp5zxXSYhqigg8ugKCDExJHMRKw9otgikrmIDFwUlwKagj4hlbatGBocqohKkhVtbmu40L8TRi7O7iJaRXMkikdMG6nWulL+/MaibXuRYC0nB+T4SnhCWYjWTqQaAQOaNraY3Y9TAMSJM1URAmbVfDKMoPNpL0yfdabSQNSg21AdBjbM8To315gs7nWoUry2J5iu51ACxG5uZutiEYoLPVUXY7muUEEMFByWILPTK4Ym8qZKIoQ1R52LkWGj8WLgR/R6H9VX/e//AExmEP08/wBMf/E/54zHeyk7j+Zf6onPM4+H0jbLK1Xk8MU9RJV0Ni25FpUCBvtaNjiN8gi15JOnVzLHMJm+mNoFh1/Blk9FWmKSIwqgg1GBkiTFSYjl97bbaQMSZskUqVZGVvDBEhjI07gHYSSDt+jB7mmpUlQzG9DehPie3+oUEEUFrcflCJHD1c4IaWUgarMIIgwLbqAfI9NsOfZXOaqWibp+Bv8AjOK3xvLNSqhwGUVIYT3MFrg3gmflib6UaFcMZlhNQCJDGQbbQTDD1xsdFzkyFhafhoDys78G2jN6SkKxEso1uOYr4udaQ74ehzL+NUAVAGVQpIPqSP5kYk4H46Gpl6VVVpo5P1gkw4HTUq3jc+cbnCThPG3VEpU0UnqT3LdADexH34aZfgZJ11qjFjDFVMdZEnfcWiNrYdXh5OOSAElS26xcgWNHqLnQEtQwmJq8GpRUoJR+AM5oRoG03UKkGFnEataizxUbmZmbZfEBJE2PWDbp8sa1MvTpUkqVYdmOoUlflM3XUAfP1tfe+meSjSctqLsrSqElhbSRJB2IkfDEXC8o1dhUqnRSUgBgvLMjbyE3PcjvjHmS/d11IvdxcOBYMTRxTWwIppS1iYgKrXmKHtf1zdhwfhz0iK7UtcySqgSk/aCmxtNsS55WqstbwaqoBzFgCHa0HwgIUA+V7euH3D67QoYqRpuQCTYkE+gjf/KSRxGjMSYESYiJnfqBb8MbEuRhMQl5M0g8w79la3qSBcWDZUzE4qUppkoEcHZtquPLjUvFdgZmE0ayNRqsVUNaQBbpGk6e/c7P6/DqaUDAZgsMqao1LYcwsJ/CR3xrwrN09emmhVVLTOx3nY8vMIE98eZ7LJWdiAwkAMY5QQJNydx1iZ+M4TmYdWXKarUWcWDgAVpmdgDSlNLsS5wd7ISHY89h8JDmxHYRAOW4ZR8NalRAag30iSZMCzAmDsI74Gr5lqv1lMkKpVU0g784KhY5hpvcCx6bYP4e2vWEatTYnSrhRoIFpBjsJF4usXM4ajIBVq+LUWGViWGmZjfS0mbGAB0xbEz8Qk/AyGdwxJITfM5cg1/DUC+YGIky5KrrdT6vQE2ykUBFNWc7ERXq2Zo6QEPhupPKbgEtpJ/S2gERY3tc4Y1q7KvjhRqjUpudOmReNpAkTEx3GEtMtVapU1aRAJGkldLH3zuVm1hJ/HG+QLMqK9Rad1A02kQxiF8m0gxFoOEwcRNQJcom3WBsaHi9bDb4Wazx9iheeaBwIuPAWue0wPVzBh9FQ+JOqRMgzIgjoSenbzwHm6niNFVIax1AEXO5M7sTEbCw+L7L5VGVlFEnWJNT3dII5YEwR7twOo6XxvW4YTVHiQm3MwIBOm6gDlBiLbEdcVxCQiYGKT+EMQSBQO21XNS2jABiSlFSXII1rStX46EWctYkl12dpGjTFZSDCkgj9IHliD/MHvhZksiWUUh+ergO7NeRqnSoW5JkWH6/bDT2ty1M06jIeUFAoAMDYmCd5JmPMHB/GXEUygOoOjKFIB5hpcAwSbE3IiPTA8RKWQVpQzFLsQcujEh6k1q7UelySVJGVJU7u1CH1oGFAOT6cB6laqtWmuYpkAksNTSrNMwpEMATtbbXEySbHw3NeGjNo0wBJJMXB0+6xMi9yP3RqMnUqgvXQX5AugsoRTzXJGrZiTANl+Cr2h4d4dCvRQVBUeCo5tJpKuo3c7xqnY2iNiUwZBkKSFgFTp+EmhIe7ZXBUFXodiHIUzM6cyXArfUPzzAMCHaoGoYC+yNFnnMFS1auXjUTHWPMhYmI2k/Zw/4stKjR8SqhTTZl3NTUWNwAFVZ5v0QR5RiD2dzHjZdXoro0BRqESpC6SigjrMSbXtJmUntLma+ZZqGoIKRGosIDPAIQ6RA6knbb1K0wTMSt1EAAl6kEDalC1K3BIpDSDkT1Q5LEWLlr+Pa3OFvsv9ZmK7lbnSoUkCFJi5aY2W+2DeKss0j7xUpSYF9IbYlGGzCXW20bE4T5XNVqfiV6lLVSzOrXF5hveXVJA1NY9juJBxaeH5jK1KT1KWobK403CGJD7LdpuPIGdw1MnzEoUgAZVAOQRdOhU4N6AVNAzOWWRJSpSVl3DtfVqtX5CrGEeTvopNK1FswbUTFwsayBokxKjqfiUODvobXpcSqqXgSRyiAT1IBgxaRM3w7z+XpmuzLVNJxTVt9R0kuvvb+cXG8nbEnFMuSFfxmzEe6whIJdl1LpUyoZouAp6TpsVJMlKFTEKSpZs1a1td2PVcgO/Wow4kTCUyyCBrpwrbmwJbQ3Na/2Wqf9R/vT/wDHjzDrn7Zv7/8AhxmLe0w/5ld0v/diuabsnvV+iAOD59fCJaQwB3TUr62uCtrtuCCLiJFhht7P0JJakyNT1QVWROpbz4hPKL+fntgDO0ApSpRJFBwSCYPXVLk7Tc3IE7bX0y9cNV8Sg3h1SCSvLpMreL3AGokHqYgYIB7ROUgXpo9X5HQ8buSHI8wQXHqnfvEvtPk0bLCFK1KRAeTMlgRaAARYXHaMVHheReu5gkndmaTA2kn7sE1uL1qjhapFmvaDO18TZTIUVWo9ZyACQqKRqaPXYTF474NhkEFiHat2o9a0+Zis9YIoWelnrpT6wz+lUcmmhCC881p1CIIa4geX+uK+a9dgQA6qRJs1wBve5G57Y84NSd3Oimr2+1so77j5/wAcNVztZy5FKnDKw1ISguYJU2O0DSZBg2xefiULmulk0AYaDjUXr4wvKlFEvKo5i7ud/k2kL8jw1aguKpfdeVSrD+0R+OGmUp0gKet3UA3czoa4JBjlBnqGImLWuzocIqVKQWsaVJaRAJiTqAgSW5IPLMAz92GRVUKrWFUOTHiJ7rRsSAYNgBBE2G+kEHl4ZSwFGWKak0IexAJ8g/cCCbiUglOY1cMLgtpSo767vQLP8ZoIS1EeI14KQxUsDaxBIG99sBVBVdWelSdGqGWdyuxvdSxMAx0ve2GXHMpTp1NVenSdWm6rDKIiSJtMbg9NhgfJVNWoU2FQMVHh1DzMEMpG8iBYnbsScKrkTkBWRYQxPVILgaMz3FCpyq7uKwVE1CmBSVO1aEE6g8rszbVjbgXDnany1KVQMQYMmAV0mBPna4PKO+J+OZdTSFOgywA176gL6iO0zc79sa8JyEt42gwQS1NuU6exLQHgjc7GZmMKs3xnQfrKQ8VSQAWnVuVJiywTM/xxdakqSrqGoopzdBJGUsNf4gQw3iMq8461jVLfmDVDkP2Dtd4Y5LjX1K6UMw2rbki2ph9+Bvyu2YQ5dV1OeRqoiAC20wOm3UntgenksxX5mekysIcUSASBAI5v2bgRecF12p09K0g3KDCMBpkRIIIkbzMG8Xw4r3hclPtwMoYN1Ta7PQm7EMRUAikKoEgTVeyqo1/FTm1hwNDQ1MPUyYUqacKAOZQLEntMwJuMCfkuhUqNT0MCbsV2FjAmPjMAbiROJuGVGKg+GUWOVTBjtBHSPL54ZUqZayko0GGA3tJBi946fvwxiMLLlYFSpKMoYkkuSAxdQBJ0sCQyXLGxWkYqYvGJTOW9QzUBLhgSAOL6PR9l2VylTXFOsVVQqkMdMixlQSdiDaRMH0MueoowOp2CvMCdoAIHN1KqIkRvcjAGdy9ai/i1GQkBpFQQvLs+oGTe3Q33E2VZyozPSfxFNKowcwrJyCdYI6AkDUP2d7483h560PlY5rFQD60LsKh6sKKYKsI9HPkJWOsCCNASw40exahcEioNY9XLrXrOAx+jZcjUD/0jLe5H2QRAm0kd8b06wCuzKz1NbCTBZQpGiNQ1DlIMDfmPXDH2cyJOUpikKY8QEktMqz3G0zyxvey32wszeQDVanh1bzpeAFXXuRtBi4v3sd8Ewaiia6g5YsSA7ggFVmcvUuGelXAnEJC5dCwcE1IFQSBd282rxsORzlfTdW5mUCQRaCAxAMtI7b3wJx3ilQoGdPrJRUpwbuwEySLxBMT1IvM4U5jib06L02qFiquUU6rEEgHqCAdlIiTaIBAuaplTQevWZhTcSpRQArAnXKxqIIuSJAw2pGJmsqYkKSAeBTcUALAswGawDjqiF5XsJKilCikk83sauK/mLXND1jDv2fy30ZFC85Z5c6REkESkgQAYuD3tMYAy/D/H4eqI5SpzGpqkh+cltr6iYBPw2w7zXEsuqq3LpIhX1reIEkkCTY+U4UZPMH/lCUlDUxVYl9WldJVCbBgxhjqA2M3O2FzLSiSZqgoTVlQABYAhgHJUxDEJCTfYtQ5WozAhDZEgEkgkkF3ZhQ65h9oWtxBlydRj4aVNZWnp1BSsIDo1NcqOWI+wBcjEHs7xXLUXC6hoK6peZV4UFSdMEGAZAtffG2e4SBoy6KfEk/SKoAkLBa5/XGwJEQAfJjw6iXy6FUV6tZyX1ReSRBm4ZdtpgYXw6xISfZ9Ugly9q3YgileJAcUMXnShM6syo234aXNNB3RMvHVUaggqG51k8gncXkNFjaYjG3E69R4p6QLBjMAsDzQp1aYJE7AQR54BzvDXpMalHTRJkabaSQRuCCqm3vAn78BUTLyaDioBYSGBgWMMoBiwiLGLYaKwVkvmJrqnt5GpVRnBI6wcBCMoYDK1O63d+HcNoWM2nP8A9LX/AN6f448wy+h/qVf/AA1H/jxmMv8AtTo38h/m/wCqD+7Tv3if5f8Ash5SovVpFEqOaUaRNgSCSfsj6sKJ6ST061fifAShkKdLMVA2CtawkyYNp79Yw+VxTo+KyaVcAQDJYid9pgqsGI9TIxme5qBqOzIVViEMWAEqhDSbnqY6R0jSHXlgE1A1Nd9fMUps0KDqKJanCOcGnDxazETvsfvw2zmWXWtRlZlZQYFhcdT31dPLA2aysBag91vuI3GLbmOHaMpSrxrKrIChhySG1BiPegmT2J9MCxE9MvLxLN58u2CIS4I7YrWUyJNPV7qGAWuBym5gDzFv44MTjwNJaJWw06fDiVAvLEjmMknp17nG1WuEoeHTpq4dyFaDOwEjbcwbjp6zP7McHJZ6dQQzGLz7y3Ana5MnpA371CgXUsVBpoduYIfhWkQU6PpB2e9pV0AF3ViqqUKgoAN/d3k3mJ6XGJsn7QU6s03cKpWVJGnSZsAYGwg6rXxJV4NVpUv+UZValxEC46nmiw8ie0YmocGy1ZZ0rTbfSCQQG93exJEfzbGvgpkxUxszLaqS4B+fHQdzRn4qXL9m7FtwzjxHrdxArZevpBDLVMqAVXUCZ3NiAZME/jOPVzNfTFKilLSVlmA1e8GOlItBabCNsQVfZCKgh28O+rvtaLQb4jf2ZYTFZ7iDvt2mRb4YhXRuKScskG71ynmx6t2274r79hWeYsdyh3ivc7RPxbilnp1qmowWUluZZHu6euoGJB7nphVwbgDMBUdRLcwOqI7SpBB7+nqIOy/ADTEBKNQTPOGB/Z6j7sMk4mi2qA0T+vGn+yynTh6V0SVIAxCmPCjvoTUcmL6OwaEZvSoCj7slxx4agUVzenCseZTJugkKjEQo1zIE3g9rn+bYlzHCEZxUO+58zazE9LCB672gevxldQ0upUEIeov1kTsAbemCV4mhdUm7LIP37b7X2wXDowCgJeZ8pygEs53YfFmcXccoHOXjkkrytmDkgWGxJ+EjgxrBlNAAALAYjztQhDEzEiMbhseVaSt7yzb5+Wxt5Y15wWmWcgq1A7d3ytzjMkqQZgKzR6ln7/Mwk41nFfKqSGFQC1pmSZLtueSOW0A7ThTUz7dVIY02pxAIWSWGkLYrqmTv7va1ho8KZal2lIMryjTbbtpJ2EyBfpgXPUIXSmmo6nSSpBlg4eCQLi+mbmCI7DxIQiWjr6qc5qspQcs4qxJargEEq39sFlamToKZXFAWDs4FAOBYpy0qLw3NFKCNSAlaaguJMArpIMG217SIm9sBJmFYs5RySZ+rBUSZuNNrLy7fODiTJuPo9dQxVi1QaRc++RoCi+rTO4NlOwwbw00T9VURhcqIsrEE2M7T8Ogx0tCFqIzpcAVbS+gqOsaAkCovQWWtSAFBJqTr2UzEbUPyEKq6tVLLTTSBpLsZUyGDQq9W25jOHicLQDXUb3Y9+eaTp28tRnVPvX7YnyOTbxVLUVphoh3DEliSI76trG5t5wdTziqGRbEjTo0hZAG01LKAWE23n9GMRiphnS0pkkKLDqjZ6s47iQTWhq4nDpEoqVMBAe5bbWpGhpa20Uk5VqdUqtQojSGHvABt1uLTFvQj134fxApVfxChl3iqWi4GmLGNlsCQDpIw7bhNPQjawV8SCRs5LBQWktM7ehHYQsy9Gl4LUdBFXVVTRpljrJ03PKoCaYbbFcQhSV+zmAEpHOhBL60YG9SGeLSFpUn2ks0JazVFNgSXPe7RYqWVpilUOo6WK6xABKTc3vIAFxsEGFHGcslN9dDVTA0EoRylmMBjI25gJBEx1thorOKISqtMhQrSp3ICrDWuCRtvERN8BZjMa21+GSFXSOX3J+1HY32X5SMWRgFzFA5mzEllF+qzDqglzQ1cs2yXgczGplg9VwALD8T1rRrjQO/Fo9XOPTinXpgODKw3IVK21RJYLIAH2YvYA4B4xnA7oy1YiZZB7pIIgd1MdZnfpbR6bu5cqQLMdIInVEABpBsT/euNp0XKFwIpuaat79ONUQd1F5AkQJnta78tAkyAmUWCtQ4c3zbcHItY2MJzCJk4qmByNDlIFLb9gJJNwdDPplX+sr/uKv8Ax49wv8DL/oVP7zfxxmC+/p/+Xef1wD2B/PM7xD5K9N9Bqv4QpifDVbggRJ1QS0iZ92I3i2marGvQehpYWJQ2RWOoESBILCw6CCOwGJ8lR8QOK+tQHOiqtmBUkEkluYwBF9ltg/jRoLlnpKQCwCLrgcwNyWEgAjbaTfvjGQCX6zMW3towalNjXaNInhFL4TTh2y1YaQ9pb7D/AGT6TY+WHeXFQZLM0X1K6AQOyoQjgeR1xbzwMFYqqZxGUbU8xGqOwYrIdfMXHnti18OylR6lGpmF5ApoVCLrUWNaOpHvaoCk99PcDFFgqINLvwcG48j3QVCW315sfVO2A6HA6qZSl9Wl01EFwCzM0qIaxYCDF9u+F2Y41WpV2o0SLEl4hdTxzEGOWLCRv1xffacs1BGohSzHQsydBIhm7AqJvvJgb4qR9m1FNAHqGm7QzIpZmIbSVNgYghhG41T0OC+wCJ+eUeLvqddAzUAF9SIEKoZf3poO3yitVvaFxUJ8Q6jvU3A2mFG4MefbbEb16gAVq5qiAodXkKL2KkCdgfh6Ydv7OZdKgEO8koaTcrK8a1gix1KCADaSO8Y2QgUWWmifVyCJgtpAnkBXUwJv+kPPBCG+LXV9dK2cX12MDbanCCuH8aCDRmSFdVmdy1+8RPaN8MMtnaVWdBBuQPOACY+eKhlc46EioKegrrIsCFJI0r294xcb9dsFZPjJR2FJTAKq2pRaxi+qTzdfPzxq4bHrQwWQQ/aB4eqmM7EYFCwSkV7GMWSrTjEDjG+TzRqrdWDADVYgSRJibxjxhj0MqYFpChrHmJ8soUUmAc5lZ0sgUVEI0sVkAdQRaVvtPn0GFFelUphT4SagQWqKzN3klbEWJHYTG18WIjGmnCU7ouTMmGY5SS1muKvY1+VLXdkdKzpSBLICgHu9jpcU7IW8Noc2q+zc206txp6cw38vjhxOI0WMb4cw+HTIRlT6NPp6LmF8RiVT151ehpGmaZShpkhS8XtO42MWPTViPL5SnSpt4al00jXA0m5nUA0nVy2FrTvMYD4pQqGojo1RYH2Df1v6/jiQZRqyCrX1vpUi1pEbmCDPTYbwB38x0tglzZq0pQAkkEkMCWI6xUS9DU5SC2ocv6TorEy0SkFSySHABel2SAL0ACXcO2UUooy+WYLWJSjUWlTCoWUamVV1KsKPegwT+GGvCXFLxW5HHLABNoXm5agMEkkb+ZicGV6ApUH5SWqe7csbmADq+yqxt3PqYMrlEZS1NW8RiQzQIG9mUncGLr59sIno+cEEAPYZQdbvSwe4FjUOC50Rj5RUCaBnCiGDbOdWfLSovYiJcrn1iFch1Wd4C7SFW0bzYbzic8Ny9U6TDbwx5WIA+Gq4PNBm282NylAALrJLCL97mQYIteBuPLEWXyFNKpYMCwnlM2SbW/a67YuvBGTM/aIGVjlzKSBm3oQXIYcCes/VaJONTOR+yWXBGbKlRLV0ago9rANcmK/x9KlMCk3ho7a4aSAq+pY6rSIOlvlhEmVFaojUw1V1gu08pUrGiwEmdosBcndsXLN5EMjVqZZtVYsG0yWXwgk7TpktB2O9wcCJRDLNy1fmZdJsYmIC9tybmdo3XKFy1usqLGpVfm2rUTRNsqgnK8MyimZKZAFRTLUHi+j3qbuMziBvye9KmjquptWoDU5BHRYY2ISQIG89JOBPysabaGpmmq/ZYWBvHu2IG8Kd/TDzO5Iil4orMogEjVcLA6kSSDHwm+I0yFPMUdRLeKJ06YUwpg6VVr6jcE9R5nU9Oxc2TPTLlPmFC+UUoQWAAIN3NQHpchCVhpU6SqZMy5TVgVFlMXDmzWFWfgyYQ5yvUeoTpcoIUgRE9tI7xIM9sF5PL1DKFVpoyjmWxJtfTE/AEH16F0wZDLVcq7eGXc9wRq5TIOuBsfeHWcF087WoBW8RXJ90lYKmxOqRJIU3joR6YHMxHVYqKVq3D5vicDLmJTcFwQ1auAbowxzBkhSUtbqlPwsTmCUhViGY/hYMYG/I6f09b+6//wAOMwX+Xz+mf9y+Mwx7qv8AeJ/yk/SKe8o/dr/zP+UP+HChUdEek4q0wCZUR6kgAGfd22HaCap7Y1so9TQWNEhizQGYnfTbZLGdPpi+o+OZe1FVKWbraqfiuWnmJ0iQCLCJgGLnEYtGVPV30bbcvHYdTmvz+UH8CNJTpoZitUJF0GXLA+oDiR646b7P8Hy61BBUqZOkCwYQW2JVbwdIC7AwSJHJMlmKtSmXrVfByym4QBQx/RRRAY+ZsOvbFl4b7RtTFKiiqgbVW0AElKaJqWT1d9EkxtHe2YMoJzV+o0sO2lKRouSAU+n4Ek8jrHRuI8LpNVQgwKckBTs5nmiYJuTzT6b4rPGeN+FAZQSjJLEqoeTYqsgElfvn9ESkXieazRRFqKrtTpugZgocMg8SmQpBPMCwI2vcSMSZvKJlXVPCVqbro116hkOTpcqWJ0ATAMCY+bKFsl0Bq3+jPAJgc9Yv67PWkb0HylbLN4i6CCNQFnJBDAhRzTq7iT6HFW4jw+jl6h/OGSVV1nUpuCmoNzW3BE9L46hlcvRCBqUFWOsNOqZ6gm98JuNez6ViWJYNYi9gQRcA7Hl6YanYf2ssCx4U9euUJiZkUTpHN6HBi+YDsrIkqSzSbHbUTNja8dRhmco9NXARXAqFqhNhywJtuZMzNpv0xaOI+z6MEI1M9MWVmOlo7gbfDElDhKo5qCRI92bCTJ9em/YdsTJwS8oSvv8AXLn3xSZikio7o0Cyo9B0j7sC16eGrU8D1KOPQoW0eenSswhQRjMG1MtiI5Y4ZEwRmqlLTpA4xsBiXwjjwLi2aKgkXhbxSu6FNIMSZIXUeUatiQPvxNlpLAa20moAQBpGky1wTIJbSD8emx2jEPhLdWJ5nkFiWExax2gjpHkQTjJ6Sw0yYM6CSRYAgaaEih2LjjG30VjZUo5JgABupiXqbgXSAavm4CAM1xHRUqEzUGst5BFA0iRM3eL7XOPa2bU6m1NtqIFpBUWJB25RfpcRBBI/FMiilmVNZUMo1qTBEySeovM2+QxmVylQUYY6gViw5l925uCRAnSduuMPCqxC0JSahIeuYAO4c2J3cE7kir+ixKMPLUWoVFqM5ZlMA9OR1sCWg7hfGXZG5SlmGs7COSST1BE/A+UjtSFS3hhlMszEqz6YAm15uIXeQwtpGCODuKlPSRBiCrCzAACeYSRt/N8GZfJBazNqBLrqWRdSOgOwiSQYsSO0YZ6RRPyImYclRZiQA/Bzprlo+Ys7kCEcAuTnXKnAIq4BJA4tThWoGUAtQwrfNu9EhgUAKryaQZiRcX1MIsBYjfGlavogloUAjUAfc0yGFt0mASbSN8R8W4ZWDQ5LEur6hdRywdW03JtY9QMT16FnRdLNyaeZlBLXKsVENIXykE/HPl+0ytl+HRy7lyAWrcEAVIem0asyYh3zXF2owNWdxsToWrB1GtTqqruYZdiRZrMO8gajMdRGIEqhGIaFcMaiMie6GEkG09W374W0eDe61SktFBJnVqEy0DSek3jzGIOKZF6gUCpqfTywdJYdxv11b9P0ejyZhnyVTFoTMd2IT1VBm1ZSnqxANXDisIKkiTNTLQpUtmcFVQbtYpAH4g4DMSksmGX0yhS1KdL06h5dH2bA3DGNUkgncDTtgZuJVkIOoPpqKIgkk2lTvBBOx6YEIo6QRr8ZVkkBQV6ExeQesE7CPILLLDoTqAF0aGGoGRMm0ztO+LZlSWQlZrQDM4Z9tTuS4YVYkvByznWuXap6rF2uDoGs1dqBw8/2hT+pUv79P/5MZhXNb+rD+9S/hjMV90kfuj/Kr9MV98P7wfzD9UdPXHM+LBWr1a1cyodgqCxeDA9FgC/y746Vnn8Km9Qj3FZvkMcYzVQsb3JOKYlWZg/r1rDUhGVyfXraGFGu1eqHrWpIBFMWAE8qAWFzi48CZ/CGbXLpVZ5VxUO1QzDQRyqUI6xEeRHPs1mYC0xsLnzP+mOpZXiGaq5KmaWVZXeAtRDaxB16VuRvYmxm1sJhCbmm3f8AO5+0MlR+sVni+cq06tHxjBpkg0gCtjBAUrEmCPXf1Z+03Ha6+DWakkQFMhbVACp1CCSJFhMb2HSbh3s9VfX9Jp/SxrcakfURYM0ASsktAJAPysx4l7L06Ipg038Eka2ZVYKouAQgWBzGWknckQMVAIFLer+MQWg/2Q4zTzFGFCqye8qgKL3kAWicN6q4g4R7K0Mq7PTB1GbnoCZgeWD6iY05KiEgGE5iawuZMaGng5qeNDSw0mZCqpcANSxE1LDI0camhgomwBUqFbUcaNRw1NDEZy+CpmwBUiFLUMZ9Hw0OWxn0fBBPgJw0KGy+NDl8ODl8RVUVfeIHqYxZM+AqwghSctiOlkdJJkme/wCAGwI/ecPBQBEi+MOWxypiVqClXFr6+tY5GHVLSpKaBTPQVb1o0J6eWAMgX2/j6YXcSygRmqXJbemCRqAk9AQSJkWBtY4s30fGeBhXESUTUBCWDFxSx1LOAdfPQQ5hZ02TMK1Opwxc1I0D1IrtoGimPmmc+F4rNcgBbHe0hRAPxMQCOuJKmZqqsga9IVjtaLXDCQdMC03JvviyZjgdNjq0hWO7KBJEHlvaL7YAoez5p1taOAhHMCslja5PX3ZncYz04edmClvn/MFOwbioE9yajUVOp71JyqSkDJ+UpZz2JUONzep2iyFV6iS6i+xGxB8tR+XnGPMxkAZZQqsdzEA2jmA3sTh14HYY88DG0opUOtU7699/VXrHn0pWhTooHJbSvCx5tya0VvL8FAA1QxDEiAAADYCOoA7zue+DKnD1YAFQYiLbR0jsRY+VsOfo+Nhl8VCZIRkyhuWzN5DuEcr3hS85WX5tfZufnuYS/k9f0fvOMw8+j4zBfbiA+6K3MczzftK1Sk9MhpYKJ1sQIaTY9xb4YQ0tycCZdySYwQ7R8MeWU5vHtBSH/sTlqbV3qVSIRbA3liYFutp+MY6HQz2pNSVGK+RPyjp6Y5XwfjLUFZQgPiESZg26YsPDuMUgPDDGmrAxq2BPSb9YvPTbtVU0oNRTxiyUuLxYc1kpYulV6TRbQxAB7xMHbaBj3OZl3TQ7lxaQSYMeUxhdlqdaoiNQV2XTYrt6GbT64UZ/O5oK6tSdQvvOAZXtcAR8cVTOkAlrnRx5PTuipSo6xZavFswokVnUD9YwPhiCl7V5m4WuGjoVX96g4qGSzdQlNXiQR70sQZ6QQeh6YkomqSGCRHL0ESY5pi/fzwYYuWksoNFFSVEODFzo+2eZU8y0n9RB+4/uw1yvtvTNqtIr5q6t9xIxQqlOtB5BPSSv8cRClWvIUHoeXtH2bYN7zJ0+X1gHspm4jrOW9ocs4nxNH7Yj7/d+/Eae0uVIk1NP7QPeOgPUY5TUpuqnSrFu5AjfcRPTEKVayiShHQtcR69NsWE5BNz67YhSFAWHfHaMnxGhVjw6qOTNgb23sb7YKdALG07TjitJGAYjUbj7F4PUHqceVmqF1LeI0xLFTb+dsQcTLBLKduHb6+cQJS6OBXiOXrTiI7MWTbWk/tDHhQWgi+3njjdLOVBI+sAEFQQ02+4b/jgc5+qWK82rYb2mIFj3I64B78p/hg5wiWd47PXKoJchR54pntFkA7NVWvr3OgaSdKtFrkidJAsBJv1xXOI5shgviOwEAsCSZgTYnvtcYEOd1IBytG3NHLJ6dObpPphZfSmcOlJb16+kGTgRLNTWLjwDNVBoFJkNHWAVJUFVYzqiZ698XFzTFzUQDzYfxxwqjmtIABAMWM37b79/K+LLkvaJmRCaKajq5tI5oiSBNz5AXOHpOMGUqmU5V8Li3qsIzcOxZDdtP6x0lszR/pafwZT+BxBms/RVGYVFkC0AtfvA6Y5xxvijAIzqYYKYRtEdSIAtbribhzJmadQ+IQ8kqOqgCTqIHWfusMLTul0plGYhJuwJZudHtxIF6wSVggVAKI7Pv9Ia1uIvrZzmdAIa6rKgzCgzN48hH46/l+tTqnVWpVVGkwFddQYTa0AjsY9cVuqrsBT8UNO0rN+3NfaAYv5HC36XBIcumqDME3AjrFvLCcvpCebHxJ8C3E0A2hhWHlHTwHyi9p7ZgEeJQcTt06x1tvP3YZVPaeiqhtDgmYDaVPymfjjmP01mMo7M4O69R3I3+MYNq8VV3HigypEFeh8lEdb4LL6QxT5Sx3pXup8+G0UOFkGoDdtPnF0b2yVVJagykbgkj7ysYh/23WRFJbkX8QR532274XjOZcqalWrAeR4caWgGDqM9TfAmZVKTqgRArKCNNxe8b73xWV0tMV1VOFcqUuKgO3bFlYKUKpqOf3i0f7YJ/Qn+8P4Y8xXvFP8A1X/6/wDDjMW/tWbsO8fWJ9xlcY5/l+X4nBCnV+OF1CtucEZWr71+h+7DIEQYJ+0PIT+JxtnKknyAxC7k842AAPlfEVbMFpO+34zjiKxcClIJ4ZxOpRYmk5Qmxjti48M9vjBGYlgV0kDYgzJi3Q9/ltjnyN1GJGPfAJ+DlTvjFd9e+8cCQKR1vgvtJTNMJSqKqIp0rC6lVZH2gSRAkctuuDeGcQ00FltLbmArjUTqYgESeYmym3wxxxHi87A4Nyucq0/dZhNgZ+P4xjPmdEipQrvHz+3CJz7x2QcYYNTDVab+I5QBUI0nQzc0tP2Yt1jBVXMViDoNJt9pH7z+BxynhvHq1V6KVmDKKtOdSgmSY+USfXF54nmaJqJRroup40GCQbxZrQ0xsRuN5GMfE4VcpYQqtCaDQX27dhBAXh1rzUXpp8Kn+mNjXzX9F8nH8ThZ+SaYMK1YEjYFiCPMne/WZxqGq06i0qTtAA1Mx1RqMICZBIYgiZkEDvhJKUq+FvXaYgwxq5qsBzU2j1Q4EbNXgpVBibW/wkYmU50NGuk0zCnV03iAxBEjBNHNZiYegp/ZcH/FpP3YqU00P+L6x0CHNiOdWj9dCf3H54BbL5NSzQFLGSdJmfLULbDbDfNqSVJp6QDLgqDIj9IGQfn1t1wHTz2X7us/rs1/RST8I+GLS0LSOoDxy+Rp26ji7tUwmq8KyrkxXjyNNf3KBivcd4XSolTTqGrqrIKgFPZN2NtzIG18dAp5weKKZ8RQysVZiVnSQCIa883UCcTVUPUvHblP44unFzJZFSzbivbl3iSonWOXZHh+WamjVcwFOpi1IqwYDVb05fx8sWPI+z2WbS1DOLy6tIJpNGoHqIYbzvh/V4Tlm96khPWUA+cYGq8ByBN0Sem/3Tb5YZX0gVggKWL0ZKhXRi2hIq8CIU707zFc4z7GVWlqTI5kABSBa0mLzvJv8zjzhXA83lvEnLtULKFDUypIvOz6SQSPlh2vshk2YGmzr3gkHbpODKfs1SQWzOYX/viP8sdN6QaX7PNm5obXgo7fWOSVPmbxf5RUor6yXy9bTpYz9HJJY3FwO4mZt0xXUyrVKtYBSWpnYh4AIO4VZBEdY646i3CaY3zeY+Nb90YHailNiVzoUGIk0p85YqdV/IYmT0kwUWDsG+LfkdN272BsVK9feOZNk3RrSsyJAYj07xg/I13pKwl5YySKRJsP0je89Bi8VuKKAYz61R+tSSr/AIIwubiLH81TpVD3FHw49Yqz92HUdITFgPLccXbtKkAeMDLm3rxMUStXOsFkLqOjahPx+/GrZw6wxBAEQJMCBsJ2xelr51jKqBHQVKwB+DkiPQYa5ennTOpFawiKpEHrut/TB19JZAHQnln/AOLdxjgI57+U/wBdPmf+DHuOkTmf6v8A+aP4YzCv9qJ/In/MT+mOc7xxMZX9a3c4IoZYzAM9AB5+nXGVEn/PFp9geHg1DUqUwyKpC9TqFwVAuSPLG7iJ/spZWYEFKUWBgSn7HZxE1BAbaiNSyBeARPU4TZik2ll06TN/QdPLHWa0CmKi13emhJDgSyT7wLNJKiLg32vIBwkr5ehn3d6NUrWQH31lXEadS+pJO5vffGXh+lJhczAG3AUGOxufLk1YOQR8JjmaU29fjjesrA7fPD3O8E0UqdUVQQ6FiB9lhEp1BMEbwcLVaBBAjvecbEucmYMybV0MA9qRcQKlcjt0xOtewBPz/wBe+NKtLa4Hw/zwO+WaR1noMHoTBEzAoUhrRrgOhMGxLAi1/L0GLJxKk1SuiUBTVDq0eCJQmnB1wANI5okRtOwGKVTmST6HyxaMnnafi0VWkZWm4idJJN51UArNedxPrhDFImAhaNArlamoFxq2tdCUNaDM1nK65arL1iJAlSoRTrIcEe8ebsBv2xvT41VSmqEGDTBD2BM0VX3iSWiBygdjM3ws4tTdaTa6RFyQzUmJHMP+lYKQLxsd462Z8O41VRFValFV0LaqtiRaJAsPW3eMLBAWnMAlVTbs1AVXkDErMPsr7ZFU1FZdgsEwWmIiFkxqEwYN5ucOKXG2qCT49txpKKLdwC4373xSc04qAs9PKtUBMtTKjf8AWEkHpFrYMDFIFNCxkQG5rReHIn5mRv5lWb0chYGRDEnckcK0YNawjhmiyPmVNSmZy6NDT4jl7QOrRzBtMX2JxJX4yos2dQGbLSCkk+QOrt1xVc5n61QadD0zO6VLS1gNbEgGDBFza4G2IcvkADd3NRrwiSoPY8jeJ25tv0dsVR0QFdacWG3VJ7yFM3aeMSHgrintU6laiU6zaGMPVdQGBBXZR3v8I9I8/wC2OZpCmxgrUUOCDYA/Z6km/WOm+BPaIhcs1MOSQVOkkSObeAZF5Fx+/FNFTqTcACY2gQNvTDqej8MwZAIG7kkc6eAaKqprF1//ANAqyBYCBNpvPqLYLp+17PdswlI/omiWPeNYY7+nQ4oWssIkkiw32++BiAVREfGbz/PniT0ZhzZAHYPmCPCB5jHQV9pwxIeuUEjmFFYYEEhgWEgGBus8wPfGxzOWYDXnKgMLZSwEsJEjSLd+gJ9Mc/8AHePeYC15tb3Rbt07Y3fNliJIO3QfZEAfL9xxH9npBdJbkEi3+GJJeOh0+DpUulWg4sebSx6mLMINj8j2wzy3AyoEhCCQJAt5AA28tzjlNGuVuGgz8vj1scTeOwQqGheWYMAwbT1PlheZgJqrzP8AT946Ou+GEsaU9LIDPpAxJS4hTG6x1Ei/yxymnx/Mro01mAVSLMTPMWBINtjHphplfbGqamqroZCDKlF/RnSCL7x8zhFfRM0Voe0j08RHSKfFB0UfCMbnOE+Q+fXtOOd0/a6jChqJDEwSjGN/sqZ+Ri+DuH8SoVamlWqUzIGp1sT0XUuxIUkThdfR6pYdSSOx/ImI60XP6Yv6Q/n44zFU/KVH+uUPv/jj3AvdufcfpEZjHPqVNmYKp1MYEWuTjqXB8hSVFohaPiUvtaWeZAYlYIGvv6Y5/wCzSKKnilXKoNUpps3QnVZRNifMYu+c4qg0KlU001Kx0fnehi/SQLDltvBGPQdJBS1BAFh4/YaQWRLYFUNS+V8VWeoyVlmW1aZA3OhTfcC4MiRvj2vVNOialX6KVQmHCswC2IJCzpIkWubfKi8U4qz1NLVdZUCKgiCQZQFhDdTINp9JxaqGbcZdWetT0MYUMFYISBusXgxzA9dhvjOmYBaQCa2pr2Ei1TRuylTi7RFWzWXFKrTRlCoeYB001A62YK3utJiSekTfC7i/CaNaiBRRnrBdKiAsaT1VSdUrJ1SRaOs4jz/EBRChMxRFRpDlA+kkWBIICrcyWgzB7xiBMpW0qzrTZ2OoVfDbWfMMF3PbScMIkGVlW7OXBL1Or2JtWoLUazVMtJoYT8R4G9EFWCK9MS3OZYGLgGAygkL6mL9FRqGIgSbW3n44vWYSlmU+thnadACuXAklZ5tUG9jadIgEEmqZjgOYQHlLgnSNMNN9Pw62IBEXi07GFmFv2h63dTv8KNazQL3c5qB4WFhHUHft/N8e1kX3gSG3IjY/P92DKnB64JAQuFMBhF47AEnvgVMqSNclQDFx3mPhNp2w/mCg8CyKFDEqVU0lT4jX5SGMEGORl9RuCIMG8DG2WzvhsA2lqcizrt5qdxYRvGBCx90jYyLddvvjD/L1xU+sZfDMaTVLVCuwBGnS8bWDW2wBcpIc1L8TfhV35d0XQHpDulmqJTw6alQ4hYILEG+wiBBMBiT5YnoKoa/g7kHU0XPSwYSLyR/lhCnCK1LScuHqKwJY6CVI8wVn4idtsb/lYFTrpuCtnIJHQfo6YNtmjfa2FyHHUPk/aDDWbQ08oZfTaVVjTQSVYHQGKAAEyfrCAZE3UH8MSnMap0msg2UmTPSBbzMGbz5YCyFAaPFrFXtaASA0xZiQZgXJNr+cb5d/DXxNSiqSNLQJEC8CGgAR33i2KBFHUX9d3hz0jgDYxPxbKomWqqhUMQCRHM2kgnmmTEXt22GKBUI698dYywc0I5VUqFIRejXJkrJEfZ8r74q+e9maOpvrShNxFIgKL7mQCJgAgSfO2AI6QlmYQq24c/L6wGYK0ilkgybyDidItyjyxNxDhD0grNphjYgmdp2IkYDJ6/f/AK40ElKg6bQKJtIgDp5j4dd8QVTERGMap6fC2PXcmRuPwxYCOjynU7nEpU6gLWEyL/fgMEgjG9Fz7oPXEZYgiJy7SQd/hGI1vAP4fwxIXAvAB6wTvv0wOX6dMQBExPX5T07bdsTvmi0CdIi4XYkdSAd8BoZgkwehxutTSRe4uO8/64gpjm0ieF/Sb+7jzEGrz/DHmIynfy+kRli38H4wMsq06ikQw1qFgnVdYYQ55QbWHntLfjPBfH1VEpEO41zru2wYhGaZBMReIHXafP0KGkjw1pGnLcjaXk9kA1Eaj1AA7dAqT2gywy+paWm++omoSRBhtgfgbb74zVKKl+0kguSxOle0d3IUIcuNl6prFbr5o0XdPDXyLrzDqLzuO/7sb0faOsqwCB+jAEi8mbde++NaoWsQUYXmNU6rbAwDMKAJO8YjXJTLFYCgFpOm0xMQbXBix8saYQkpGYf1EActEWbzJqVC7sTO5JJJt3N8eUc66kOajbWBMx6Am2Cfye3hqyuCCQCI93pJH74J2v0w/wAjwQ1KIZnjS0SmlYseZtQk7Cfj1nF1GWEsq1vtEJQTSEpNfxefxDDA6ZYnsSpEEmP53xbeGKXLVDTCvBVvE1k1CQQAVUCSJBnTYdScIsx7PsyrU8RiASWaoAoABiZMb9b/AObU0qlOhJatTp2LSwfVpsNIdj9qLc09AJuNbKA34QaWCkl4KFBzOkydLczMAwW3KJkpcX1qJi8YErNmaal6dQoGjl0g6hY6pkgtBMswC9OgwVk6NV7X29xjc+dT9Jy1wosPhfzMIKZHgIviVCxfMG/hneYN22MGYFiJEYoksdIuRSEh4P4qeK9RQTsEUddtZ5QDPQA+uDE9j6tOKvj00tIuTMG8ROoAkDYThtw/MK9VeZH1e9CwHE/ai9TlBIJFti3XDStwsVGSrW00wpIV1Y+7ABVQzNqJPUA7dItxmzBr4CJEpBiuUOHgU5rBFSSfESVSCdJD02giDvy/EGDg/I8Hy9R0FQrGmwSqxDTEHmYlVKnoT0tGGHE8pTUK/iagToVOTSQTyyHAJMEiQTF974U5tPCn6JUMANqpspCySPcmY6GJAPlOBuo6/T7eXKCMBpGV/ZtFqjw5QBoQq4vftGkL1m3TeJwwzXA9ZHiMjlY0eKWB3MliB7sTbv5xiThSkBW+slRtUEyW97YwATHpHUG5nCck1SXFSnrPRrjT9mQpsogG3mJiQEcdOUlPxt57U9faFISzWeNqnAKyMtSVY6wWpgnSAPgZNrEidvU7NkOSoQgmBZuYOxi+knluIiRt64kqZG7zmX0sNgQiklohNImLHrP34MGWVGFQN4vKNKhtXQDlkGxg3Jub2jGEZimDnwI4t/XnCZTCOvQcmk5K+Jp3CaZtOlg0mOwEHbACcCy7PNSnRDTzczHcWtBgeW9x1xYcq7+9UYOyqdSeENWprRrVp/G18DtmaT62NNShs6tqDAifsG87m1rDrgiZq00Dj+Fxy2e9NH1iCIofFPZIaz4TooJMBpC+Sq8369PLC/OeyuYprqNOVj3g1hf1uIuLDfr16hlKNBl0U+RQJKupJixjS5kCQRt6WwMcgPDcCrUADgbAACxgC5HnBFpxoSulJyaE04ivr+aIylnEcgeidyO1o6YhqU4NpHpjrHEOFB0VKhlWuSEAM6onUIH6Ukx8b4Tcd9lKaCmKSux08zLzgnqSBcWnbyw/K6UlkgK4/wBatFOsmpjnrU+xn5T8se0SVvpB33Ej5YZ1cix+wRAnaDAE/gD8jiFqR7j0640faCOMwawAx1Emy9YERjwuTuSTtfBvhAkgjGjZYWgz6A28sTnETnED6h5fLGYJ+gv/AEbf3TjMVzJ3iYc8CytQsxDqmpCBUKGDIAI1AQOU3jyws4jw1qWkwYaSB6GJ3mDG9sWjJcWNRVav9YFOrStTTUK7WCEAi8R0G/fDGrlA1ICo7BNBYgq0C9i0tMmCF0g2jvGBiYpKnVrTupf00MiUCKRQ8tScwqhzINqYg2veBJA852OJvEqGnDc17C0CbyR8Pw7Ys3Ecs2nUpSmsMYBOgLMWJphpN51jcWItitU6yp4gOlpiwup+d9rWuPwZSc1oGRlhpluMstNKWkO5MITJAJhYgmxECPQfDXKu8AOdbyNNO5gg/bGkgARtaLbb4S5Fl1jVOk2Ok6SPMSIj4dOmDvpJpooDCdQKixiJidQv33jbFxLBBaB+0IMWDL5rwyHzGupVIXTSBhY6ghZAUdDEk+W5NF8wxWPsMZYKCqSAfCpWgnSADEzaOhCHMIbVGcNVfmZtR1X6EKbDzt5YYUc/VqIaVNhNNRGktEyAIEAItheZP3YCobQZJahhgarPVdGquBTDF/rDTphjZVJtriD6kkTAGPOFJ9FKeKzup1EudWkAQTJJOnrsDPrGAuDUtUUKgYqGLNEkR1GkkA+gEdb4f8N9n/FY1H1OAraRJpkieVSoeIt2vYmNyushNPp3/WGEJzVjBx13VHQ0ghnTUKGBBgkfaBsAST0AthjkPaug7LqfSyg7geGBtp92Y3iMe1KtGjTDCirlgAxpsNIA3EKdgO47bXxWuJPlamtaVKkrfZOsCesAHm1Xi4GKoZWnlEqdOsWllRn1K9KS0r2Ha4vFuv3xgDM52mrsAjCxaIMdwINybRMR5zis8B4pVQtSZoC9I/W9LRHTaB2xcqmboOGOgGXBqufIElgSupiImeU23visxKkqrWLIUFCJE3WQon3JBMmBLECJJmwm9/gOtfQHZ9SLqAKsgAuBIsSZJ73MjG548gKBKg93SuhyWAUgG4ck6Rc6jfyIEzU8krv4lWmpYtqpwCeUEczSIJMkyYPWe+diglhm8q+raR00AipgWhxCEOnLsUDTBW5LHT7rbCdj/HB1TO6b1VZVBlRqWyrAhu/4W7AnAmczzM2hqQeQG+rJXSgIgM5vA3+O4iwOaylbLqz0wY6jMMjSJHKu9iCe1xvbGdkSpnDE8eWtfI6QjlL0BPn3fKLLP1Z8Pw2YzMEpBmCZBIJBtBF464HUukqzqCzAsxGuOzFhEDlI2AgThZleL1czTYInhFmAVS4gmdRjrMDcDp0xK3C2kSBTNXdg+oEKd1WR5EzE6usEYGJOUkLproab0PZQEPSJYWgjLcTFTUxYspCh2UTpuRB1XBBIPXEf0yiPEAapEkeEQWkm+qV3XrcH4YnzldELTm6qBwL6QB09wRAYWse8wQLAZL2iouqU18UF7BCkaiIEreCB6xba2OCCQVBJbg/6Wox+oiCkXgzh1GpSot7hfVUIGpupJsSBAAOwHzwG3GYTxM0lSSwIQIQF5iem3bqYxLxXiSGkGpMwGyzsRBBEEWNwCo38sBN7QqgpqPrA4IZ02AEASG939n+SVEuYoPlueRpdjXuv4tUlxQwNxP2poMSBTsVIbUssQRqAkXmCN9jO+MzPDco6qtJYqPzKRzKNQEao6WjmjrhrX9nGqstZgmoEbUmJ0mRBAHNaLgDvgziHDFcL4tMmFKg0tSuCOa9+rTY+hvY3fKEiUlY3v82fw2iCAqpihf7G5hpYaN7KGEdPkJJHwwmzHDq1MnUrATv3gTPeIGOpU8mHVhRVwxI1a6bBr/rA7z5HzxBxH2dzfgKpdKsAxCQ8GLbGRYTb+Bbl46cCBMT3pIpvr8oGZZ0jlPir3+/HuLT+Rs7/AFL/AMn/AOuMxo+0Xt4/aI9kd4q3D/zlL/uv8RxdPtJ/3/8A6OMxmLY6yv4fkqNXA/8AmR/EPMQt4n/zyr+y/wDhxWBvS9Kf78ZjMaMrT1rCE63YY1y/vD1H4rjYfnPifxx5jMF/DAx8XZFk9mfz3938cMsp+eqf9o/4DHuMwnM+M8obl2EPqvuH9lP3YN4p7x/sfguPMZhIw2mNMn79f0b/ABY59xb36v8Aa/E49xmDYf4jygE74RA/sv8An6f7I/xDHXKX5r+034tjMZiMZeJw1or/ABL86Ph//WGFP/m1f9qv+CYzGYw8d8KPWhi8+FfDfdp+h/FMR8e9x/5+2mMxmKD/AMo5/OEzb1wifgn5jL/9vV/9BsWPK/8ANl/t/hUx7jMIYr4j/H+qDI+Ifwnyite0P5qn6f8AuJiLNe8v7Tf4qmMxmNCRbtPmIFI+UOeO+4n9r8cLOA/84H/Zj/28eYzCA/8AVVyMVV8cdG6j9kfhhXn/AM5/ZOMxmPTyL9n1jto9yf57+7+C4mX86MZjMWPxHlHKhljMZjMAgkf/2Q=="
                    row.appendChild(image);

                    let div = document.createElement("div")
                    div.className += " col"
                    div.style.marginLeft = "1em"
                    row.appendChild(div);

                    let title = document.createElement("p");
                    title.className += " title";
                    title.style.fontSize = "1.5em";
                    title.style.fontWeight = "bold";
                    title.innerText = data.title; // Render the title
                    div.appendChild(title);

                    let text = document.createElement("p");
                    text.className += " text";
                    text.style.fontSize = "1em"
                    text.style.fontWeight = "bolder"
                    text.innerText = data.post;
                    post.appendChild(text);

                    let tim = document.createElement("div")
                    tim.className += " row gap"
                    div.appendChild(tim)

                    let name = document.createElement("p");
                    name.innerText = `${data.user.slice(0, -10)}`;
                    tim.appendChild(name);

                    let time = document.createElement("p");
                    time.className += " postTime";
                    time.innerText = ` ${moment(timestamp).fromNow()}`;
                    tim.appendChild(time);

                    let cont = document.createElement("div");
                    cont.className += " row";
                    cont.style.gap = "1em"
                    cont.style.padding = "1em"

                    let del = document.createElement('p')
                    del.className += 'del'
                    del.innerText = 'Delete'
                    del.addEventListener("click", function () {
                        post.dataset.id = doc.id;
                        console.log(doc.id);
                        delPost(doc.id);
                    });
                    cont.appendChild(del)


                    let edit = document.createElement('p')
                    edit.className += 'del'
                    edit.innerText = 'Edit'
                    edit.addEventListener("click", function () {
                        post.dataset.id = doc.id;
                        console.log(doc.id);
                        editPost(doc.id, data.title, data.post);
                    });
                    cont.appendChild(edit)

                    post.appendChild(cont)

                    container.appendChild(post);

                    // ... Previous code ...

                    function delPost(postId) {
                        // Show a confirmation popup using SweetAlert
                        Swal.fire({
                            title: "Delete Post",
                            text: "Are you sure you want to delete this post?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#8540f5",
                            cancelButtonColor: "#8540f5",
                            confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                db.collection("posts").doc(postId).delete()
                                    .then(() => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Deleted",
                                            text: "Post has been deleted.",
                                            confirmButtonColor: "##8540f5",
                                        });
                                        renderPostsUser();
                                    })
                                    .catch((error) => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "An error occurred while deleting the post.",
                                            confirmButtonColor: "#8540f5",
                                        });
                                    });
                            }
                        });
                    }

                    function editPost(postId, previousTitle, previousPost) {
                        // Show a prompt using SweetAlert for editing
                        Swal.fire({
                            title: "Edit Post",
                            html:
                                `<input id="editedTitle" class="swal2-input" value="${previousTitle}" placeholder="Title...">
                                 <textarea id="editedPost" class="swal2-input swal-ta" placeholder="Text...">${previousPost}</textarea>`,
                            showCancelButton: true,
                            confirmButtonColor: "#8540f5",
                            cancelButtonColor: "#8540f5",
                            confirmButtonText: "Save",
                            preConfirm: () => {
                                const editedTitle = document.getElementById('editedTitle').value;
                                const editedPost = document.getElementById('editedPost').value;

                                if (!editedTitle.trim() || !editedPost.trim()) {
                                    Swal.showValidationMessage('Both fields are required');
                                }

                                return { editedTitle, editedPost };
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const { editedTitle, editedPost } = result.value;
                                db.collection("posts").doc(postId).update({
                                    title: editedTitle,
                                    post: editedPost,
                                })
                                    .then(() => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Updated",
                                            text: "Post has been updated.",
                                            confirmButtonColor: "#8540f5",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                        renderPostsUser();
                                    })
                                    .catch((error) => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "An error occurred while updating the post.",
                                            confirmButtonColor: "#8540f5",
                                            showConfirmButton: false,
                                            timer: 1500,
                                        });
                                    });
                            }
                        });
                    }


                });
            }
        })
        .catch((error) => {
            //console.error("Error getting posts: ", error);
        });
}



function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("Sign out successful");
            // Redirect to the sign-in page or any other desired destination
            window.location.href = "./login/index.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    renderPostsUser();
});