const resetForm = document.getElementById("changePassword");
const resetMessage = document.getElementById("reset-message");

let passwordResetFunction = (event) => {
    event.target.parentNode.innerHTML = `

    <input type="password" required placeholder="New Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
    <input type="password" required placeholder="Confirm Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
    <button id="pwdReset" class="update">Reset</button>
    
    `

}

resetForm.addEventListener("click", passwordResetFunction);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;

        document.addEventListener('click', async (event) => {
            if (event.target.classList.contains('update')) {

                console.log(event.target.parentNode)

                const inputFields = event.target.parentNode.querySelectorAll('input');

                console.log(inputFields)
                const newPassword = inputFields[0].value
                const confirmPassword = inputFields[1].value
                if (newPassword === confirmPassword) {


                    try {
                        // const userCredential = await signInWithEmailAndPassword(auth, email, "currentPassword");
                        // const user = userCredential.user;
                        await updatePassword(user, newPassword);
                        resetMessage.textContent = "Password reset successfully.";
                    } catch (error) {
                        resetMessage.textContent = "An error occurred. Please try again.";
                        console.error("Error resetting password:", error);
                    }



                }

            }



        })


    } else {
        // User is signed out
        // ...

        console.log("User is signed out")
        location.href = './index.html';
    }
});
