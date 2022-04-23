async function refresh_token() {
    const response = await fetch("/projectRoutes/refresh_token");
    const users = await response.json();
    return users;
}

let return_AuthHeader = refresh_token();

const submit = document.getElementById('submit');
const project_name = document.getElementById('project_name');
const file_upload = document.getElementById('formFile');
const forms = document.querySelectorAll('.needs-validation');

let flag = false;
let project_regex = /^[a-zA-Z]([0-9a-zA-Z\_\-\ ]){2,10}$/;

setInterval(() => {
    return_AuthHeader = refresh_token();
}, 900000 - 500);

function form_data() {

    let input = document.getElementById("formFile")
    let data = new FormData();
    data.append('question_file', input.files[0]);
    data.append('table_name', project_name.value);

    url = "/projectRoutes/InsertData";
    return_AuthHeader.then((token_header) => {
        params = {
            method: 'post',
            headers: {
                'authorization': "bearer " + token_header.refresh_token
            },
            body: data
        }
        fetch(url, params).then(response => response.json())
            .then(data => {
                if(!data.error){
                    location.reload();
                }
            })
    });

}

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

        event.preventDefault();
        event.stopPropagation();

        if (form.classList.contains('was-validated')) {
            form.classList.remove('was-validated');
        }

        if (validate(project_regex, project_name)) {
            form_data();
        }
        else {
            form.classList.add('was-validated');
        }
    })
});
