const submit = document.getElementById('submit');
const email = document.getElementById('validate_email');
const forms = document.querySelectorAll('.needs-validation');

let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


function validate(regex, element) {

    if (element.classList.contains('is-valid')) {
        element.classList.remove('is-valid');
    }
    else if (element.classList.contains('is-invalid')) {
        element.classList.remove('is-invalid');
    }

    if (regex.test(element.value)) {
        element.classList.add('is-valid');
        return true;
    }
    else {
        element.classList.add('is-invalid');
        return false;
    }
}

Array.prototype.slice.call(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
        if (form.classList.contains('was-validated')) {
            form.classList.remove('was-validated');
        }

        if (validate(email_regex, email)) {
            
        }
        else {
            event.preventDefault();
            event.stopPropagation();
        }

    })
})
