let acessoAte = null;

    function login() {
        if (!localStorage.getItem('acessoAte')) {
        document.getElementById('login').classList.remove('active');
        document.getElementById('pagamento').classList.add('active');
        } else {
        iniciarSistema();
        }
    }

    function confirmarPagamento() {
        acessoAte = Date.now() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('acessoAte', acessoAte);
        iniciarSistema();
    }

    function iniciarSistema() {
        document.getElementById('login').classList.remove('active');
        document.getElementById('pagamento').classList.remove('active');
        document.getElementById('menu').classList.remove('hidden');
        showSection('dashboard');
        atualizarTimer();
        carregarEstudos();
    }

    function showSection(id) {
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    function atualizarTimer() {
        setInterval(() => {
        let restante = localStorage.getItem('acessoAte') - Date.now();
        if (restante <= 0) {
            alert('Acesso expirado');
            logout();
        } else {
            let dias = Math.floor(restante / (1000 * 60 * 60 * 24));
            document.getElementById('timer').innerText = dias + ' dias';
        }
        }, 1000);
    }

    function salvarEstudo() {
        let estudos = JSON.parse(localStorage.getItem('estudos') || '[]');
        estudos.push({ pergunta: pergunta.value, resposta: resposta.value });
        localStorage.setItem('estudos', JSON.stringify(estudos));
        carregarEstudos();
    }

    function carregarEstudos() {
    const lista = document.getElementById('listaEstudos');
    lista.innerHTML = '';

    const estudos = JSON.parse(localStorage.getItem('estudos')) || [];

    estudos.forEach((e, index) => {
        const div = document.createElement('div');
        div.className = 'card';

        const pergunta = document.createElement('strong');
        pergunta.textContent = e.pergunta;

        const resposta = document.createElement('p');
        resposta.textContent = e.resposta;
        resposta.classList.add('hidden');

        const btnMostrar = document.createElement('button');
        btnMostrar.textContent = 'Mostrar resposta';
        btnMostrar.onclick = () => {
        resposta.classList.toggle('hidden');
        };

        const btnApagar = document.createElement('button');
        btnApagar.textContent = 'Apagar';
        btnApagar.style.marginLeft = '10px';
        btnApagar.onclick = () => apagarItem(index);

        div.appendChild(pergunta);
        div.appendChild(resposta);
        div.appendChild(btnMostrar);
        div.appendChild(btnApagar);

        lista.appendChild(div);
    });
    }

    function apagarItem(index) {
        let estudos = JSON.parse(localStorage.getItem('estudos')) || [];
        estudos.splice(index, 1);
        localStorage.setItem('estudos', JSON.stringify(estudos));
        carregarEstudos();
    }


    function logout() {
        document.getElementById('menu').classList.add('hidden');
        showSection('login');
    }

    if (localStorage.getItem('acessoAte') && localStorage.getItem('acessoAte') > Date.now()) {
        iniciarSistema();
    }