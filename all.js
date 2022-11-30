const apiUrl = 'https://todoo.5xcamp.us';
//註冊
const suBtn = document.querySelector('.btn2');
const suemail = document.querySelector('#signupemail');
const suname = document.querySelector('#name');
const supasw = document.querySelector('#signuppassword');
const supasw2 = document.querySelector('#password2');

const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;


suBtn.addEventListener('click', function () {
    let account = suemail.value;
    let username = suname.value;
    let userPasw = supasw.value;
    let userPasw2 = supasw2.value;

    if (account.search(emailRule) == -1) {
        alert('信箱錯誤,請重新輸入');
    } else if (username.trim() == '') {
        alert('請輸入您的暱稱')
    } else if (userPasw.length < 6) {
        alert('密碼需6碼以上,請重新輸入');
    } else if (userPasw !== userPasw2) {
        alert('密碼輸入錯誤,請重新輸入');
    } else if (account.search(emailRule) != -1 && userPasw.length >= 6 && userPasw === userPasw2) {
        signUp(account, username, userPasw)
    }

})
const pageLogIn = document.querySelector('.login');
const pageSignUp = document.querySelector('.signup');
function signUp(email, nickname, password) {
    axios.post(`${apiUrl}/users`, {
        "user": {
            "email": email,
            "nickname": nickname,
            "password": password
        }
    })
        .then(function (res) {
            alert(`恭喜${res.data.nickname}~${res.data.message}!`)
            pageLogIn.classList.toggle('active');
            pageSignUp.classList.toggle('active');

        })
        .catch(error => alert(`抱歉,${error.response.data.error}!`
        ))
}

//登入
let user = '';
let data = [];
let num = 0;
const page1 = document.querySelector('.wrap');
const page2 = document.querySelector('.wrap2');
const userList = document.querySelector('.name');
const logInEmail = document.querySelector('#email');
const logInPassword = document.querySelector('#password');
function logIn(email, password) {
    axios.post(`${apiUrl}/users/sign_in`, {
        "user": {
            "email": email,
            "password": password
        }
    })
        .then(function (res) {
            axios.defaults.headers.common['Authorization'] = res.headers.authorization;
            user = res.data.nickname;
            alert(`哈囉~${user}~${res.data.message}`);
            userList.textContent = `${user}的代辦`;
            page1.classList.toggle('active');
            page2.classList.toggle('active');
            logInEmail.value = '';
            logInPassword.value = '';
            getToDo();

        })
        .catch(error => console.log(error))

}
const logInBtn = document.querySelector('.btn');
logInBtn.addEventListener('click', function () {
    //判斷是否符合帳號密碼規則
    let account = logInEmail.value;
    let userPasw = logInPassword.value;
    if (account.search(emailRule) != -1 && userPasw.length >= 6) {
        logIn(account, userPasw);
    } else {
        alert('帳號或密碼錯誤,請重新輸入!');
    }
})
//取得清單
function getToDo() {
    axios.get(`${apiUrl}/todos`)
        .then(function (res) {
            data = res.data.todos;
            background(data);
        })
        .catch(error => console.log(error.response))
}
//判斷有無清單
const noList = document.querySelector('.nolist');
const card = document.querySelector('.card_list');
function background(data) {
    if (data == '') {
        noList.classList.toggle('active');
        card.classList.toggle('active');
    } else {
        noList.classList.add('active');
        card.classList.add('active');
        readerData(data);
    }
}


//刪除清單
function deleteList(e) {
    e.preventDefault();
    let todoId = e.target.closest('li').dataset.id;
    deleteTodo(todoId);
}
function deleteTodo(todoId) {
    axios.delete(`${apiUrl}/todos/${todoId}`)
        .then(() => getToDo())
        .catch(error => console.log(error.response))

}
const list = document.querySelector('.list');

list.addEventListener('click', function (e) {
    let listId = e.target.closest('li').dataset.id;
    if (e.target.nodeName == 'UL') {
        return
    } else if (e.target.getAttribute('class') == 'delete') {
        deleteList(e);

    } else if (e.target.getAttribute('class') == 'pen') {
        e.preventDefault();
        const checkbox = e.target.parentElement.firstChild.nextSibling.children[0];
        const edit = e.target.parentElement.firstChild.nextSibling.children[1];
        let upDateStr;
        //  判斷目前是否有 edit 的 class，點選控制 
        if (edit.classList.contains('edit')) {
            edit.classList.remove('edit');
            checkbox.style.zIndex = '1';
            upDateStr = edit.children[0].value;
            updateTodo(listId, upDateStr);
        } else {
            edit.classList.add('edit');
            edit.children[0].disabled = false;
            checkbox.checked = false;
            checkbox.style.zIndex = '-1'; // 讓 input[type=text] 可以被選到，進行編輯
        }

    } else {
        toggleTodo(listId);
    }
})



//渲染畫面

const todoListNum = document.querySelector('.todolist-num');
let todo = [];
let done = [];
function readerData(data) {
    let str = '';
    for (let i = 0; i < data.length; i++) {
        if (data[i].completed_at !== null) {
            data[i].checked = 'checked';
        } else {
            data[i].checked = '';
        }
    }
    data.forEach(function (item) {
        str += `<li data-id=${item.id}>
        <label class="checkbox"   >
        <input type="checkbox"  ${item.checked}/>
        <span >
        <input type="text" id="word" value="${item.content}" disabled/>
       </span>
        </label>
        <a href="#" class="pen"></a>
    <a href="#" class="delete"></a>
    </li>`
    });
    list.innerHTML = str;
    num = data.length;
    todoListNum.textContent = `${num}個待完成項目`;
}


//修改todo

function updateTodo(todoId, todo) {
    axios.put(`${apiUrl}/todos/${todoId}`, {
        "todo": {
            "content": todo
        }
    })
        .then(function () { alert('修改成功'); getToDo() })
        .catch(error => console.log(error.response))
}


//新增清單
const btnAdd = document.querySelector('.btn_add');
const tabs = document.querySelectorAll(".tab li");
const userInput = document.querySelector('.txt');
function addList() {
    if (userInput.value.trim() == '') {
        alert('請重新輸入');
        return
    } else {
        addToDo(userInput.value);
        userInput.value = '';
        tabs.forEach((item) => {
            item.classList.remove('active');
        });
        tabs[0].classList.add('active');
    }
}
btnAdd.addEventListener('click', () => { addList() });
userInput.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        addList();

    }
})
function addToDo(todo) {
    axios.post(`${apiUrl}/todos`, {
        "todo": {
            "content": todo
        }
    })
        .then(function () { alert('新增成功'); getToDo(); })
        .catch(error => console.log(error.response))
}



//更改todo狀態
function toggleTodo(todoId) {
    axios.patch(`${apiUrl}/todos/${todoId}/toggle`, {})
        .then(() => getToDo())
        .catch(error => console.log(error.response))
}

//篩選
let state = 'all';
function updateList() {
    if (state == 'all') {
        readerData(data);
    } else if (state == 'work') {
        todo = data.filter(i => i.completed_at === null);
        readerData(todo);
    } else if (state == 'done') {
        done = data.filter(i => i.completed_at !== null);
        readerData(done);
    }
}
const tab = document.querySelector('.tab');
tab.addEventListener('click', changeTab);
function changeTab(e) {
    tabs.forEach((item) => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');
    state = e.target.getAttribute('data-tab');
    updateList();
}

//刪除全部已完成
const deleteAll = document.querySelector('.delete-all');
let todoId = [];
deleteAll.addEventListener('click', function (e) {
    e.preventDefault();
    done = data.filter(i => i.completed_at !== null);
    done.forEach(function (i) {
        todoId.push(axios.delete(`${apiUrl}/todos/${i.id}`));

    })
    Promise.all(todoId)
        .then(() => getToDo())
})

//登出
function signOut() {
    axios.delete(`${apiUrl}/users/sign_out`)
        .then(function (res) {
            axios.defaults.headers.common['Authorization'] = "";
            alert(res.data.message);
        })
        .catch(error => console.log(error.response))

}

//畫面切換
$(document).ready(function () {
    $('.signbtn').click(function () {
        $('.login').toggleClass('active')
        $('.signup').toggleClass('active')
    })
    $('.loginbtn').click(function () {
        $('.login').toggleClass('active')
        $('.signup').toggleClass('active')
    })

    $('.signout').click(function (e) {
        e.preventDefault();
        signOut();
        $('.wrap').toggleClass('active');
        $('.wrap2').toggleClass('active');
    })

})