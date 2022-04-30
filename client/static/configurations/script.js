async function refresh_token() {
    const response = await fetch("/projectRoutes/refresh_token");
    const users = await response.json();
    return users;
}
async function save_config() {
    const token_header = await return_AuthHeader;

    let string = window.location.href;
    let index_start = string.indexOf("dashboard");
    let index_end = string.indexOf("configurations");
    let table_name = string.slice(index_start + 10, index_end - 1);
    data = { 'table_name': table_name, 'min': min, 'sec': sec };
    params = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token_header.refresh_token
        },
        body: JSON.stringify(data)
    }
    const response = await fetch("../../projectRoutes/update_config", params);
    const users = await response.json();
}
let return_AuthHeader = refresh_token();
let min = 5, sec = 0;
const add = document.getElementById("add");
const submit_answer = document.getElementById("submit_answer");



setInterval(() => {
    return_AuthHeader = refresh_token();

}, 900000 - 500);

add.addEventListener('click', () => {
    let select = document.createElement('select');
    select.classList.add('form-select');
    select.classList.add('answer-form');
    select.classList.add('my-2');
    select.setAttribute('name', 'answer');
    option_set = ['a', 'b', 'c', 'd'];
    for (ele of option_set) {
        let option = document.createElement('option');
        option.setAttribute('value', ele);
        option.innerHTML = ele.toUpperCase();
        select.appendChild(option);
    }
    document.getElementById("add_answer").appendChild(select);
});

submit_answer.addEventListener('click', () => {
    let string = window.location.href;
    let index_start = string.indexOf("dashboard");
    let index_end = string.indexOf("configurations");
    let table_name = string.slice(index_start + 10, index_end - 1);

    answer = [];
    document.querySelectorAll('.answer-form').forEach((ele) => {
        answer.push(ele.value);
    });

    url = "/projectRoutes/Add_Answer";
    return_AuthHeader.then((token_header) => {
        let data = {
            "answer": answer,
            "table_name": table_name
        }
        params = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "bearer " + token_header.refresh_token
            },
            body: JSON.stringify(data)
        }
        fetch(url, params).then(response => response.json())
            .then(data => {
                document.getElementsByClassName("btn-close")[0].click();
            })
    });
})

function select_time(id, value) {
    if (id === 'minutes') { min = value; }
    if (id === 'seconds') { sec = value; }
    let container = document.getElementById(id);
    if (value < 10) {
        value = '0' + value;
    }
    container.firstChild.innerHTML = value;
}

document.getElementById("start").addEventListener('click', () => {
    save_config();
    let index_end = window.location.href.indexOf('configurations');
    let redirect = window.location.href.slice(0, index_end) + 'start';
    location.href = redirect;
})

function show_pdf(question_url, project_name) {
    
    fetch("/projectRoutes/adobe_api_key").then(response => response.json())
        .then(data => {
            if (window.AdobeDC) {
                var adobeDCView = new AdobeDC.View({ clientId: data.key, divId: "adobe-dc-view" });
                adobeDCView.previewFile({
                    content: { location: { url: question_url } },
                    metaData: { fileName: project_name + ".pdf" }
                }, { embedMode: "SIZED_CONTAINER" });
            }
        })
}

function page_bar(length) {
    let i = 0;
    while (i < length) {
        i++;
        let header = document.getElementById('page-bar');
        let list_child = document.createElement('li');
        let navigator = document.createElement('a');
        list_child.classList.add('page-item');
        list_child.classList.add('mx-1');
        navigator.classList.add('page-link');
        navigator.classList.add('bg-light');
        navigator.classList.add('text-dark');
        navigator.innerHTML = i;
        list_child.appendChild(navigator);
        header.insertBefore(list_child, header.lastChild);
    }
}

(async () => {
    const token_header = await return_AuthHeader;

    let string = window.location.href;
    let index_start = string.indexOf("dashboard");
    let index_end = string.indexOf("configurations");
    let table_name = string.slice(index_start + 10, index_end - 1);
    data = { 'table_name': table_name };
    params = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + token_header.refresh_token
        },
        body: JSON.stringify(data)
    }
    const response = await fetch("../../projectRoutes/fetch_config", params);
    const users = await response.json();
    Promise.all([show_pdf(users.data.configurations.pdf_url, users.data.configurations.project_name), page_bar(users.data.configurations.total_questions)]);
})();
