# Firefox Security Plugin - Lelecus

<img src="icons/lelecus.png" alt="drawing" width="200"/>

Lelecus é um plugin feito para o Navegador FireFox, com o objetivo de evidenciar ao usuário, se o site que ele está utilizando, é seguro ou não, com base nos cookies, domínios de terceira parte, local storage, e se está protegido com a segurança https ou não.

Os passos a seguir evidenciam o passo a passo da codificação desse plugin.

## Configuração Inicial

Para configurar o Plugin, o primeiro arquivo a ser feito é o `manifest.json`. Nele, são definidos itens como nome, descrição, ícone, permissões, qual arquivo HTML será utilizado para fazer o FrontEnd, e qual arquivo JavaScript será utilizado para fazer o BackEnd. A seguir, está cada definição:

```json
{
  "version": "1.0",
  "manifest_version": 2,
  "name": "lelecus",
  "description": "Verify if web page is secure",
  "icons": {
    "16": "icons/lelecus.png",
    "32": "icons/lelecus.png",
    "64": "icons/lelecus.png"
  },
  "browser_action": {
    "browser_style": true,
    "default_title": "Verify if web page is secure",
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["popup.js"]
    }
  ],
  "permissions": [
    "cookies",
    "<all_urls>",
    "tabs",
    "storage",
    "http://*/*",
    "https://*/*"
  ]
}
```

A partir dele, é possível identificar que:

- `popup.js` foi configurarado para ser o BackEnd;
- `popup.html` foi configurado para ser o FrontEnd;
- Foram adicionados permissões de storage, cookies e informações da janela;

## Estuturação do Código

Como configurado anteriormente, a partir do arquivo `popup.js` é possível obter as informações da página que o plugin está analisando. Entretanto, para passar as informações obtidas por esse arquivo, para o FrontEnd, é preciso que haja um script importado no HTML.

A fim de manter a organização do código, foi feito na pasta `scritps`, um arquivo para item adionado no plugin:

- cookies.js: obtém todos os cookies da página e adiciona no HTML, identificando se são de navegação ou sessão, externos (provenientes de outros domínios) ou internos (provinentes do mesmo domínio).

- localStorage.js: obtém os local Storages da página e adiciona no HTML.

- thirdPartyDomains.js: obtém os domínios de terceira parte e adiciona no HTML.

- https.js: identifica se o site tem a segurança https e adiciona no HTML se sim ou não.

- overall.js: mostra no HTML o nível de perigo de um site, de 0 a 100%, com base nos outros parâmetros já obtidos.

## Obtenção dos Cookies e Proteção HTTPS

Foi feito uma função para obter esses dados:

```javaScript
var getAllCookies = browser.cookies.getAll({
    url: tab.url,
});
```

Essa função retorna um objeto com os cookies, que tem como atributos:

- `cookie.session`, onde é possível identificar se o cookie é de sessão ou de navegação

- `cookie.domain`, onde é possível identificar se o domínio do cookie é o mesmo da página atual, a fim de identificar se é externo ou interno.

Já para obter se o site detém a proteção HTTPS, basta só checar pela url dá página:

```javaScript
if (tab.url.includes("https://")) {
hasHttps = true;
} else {
hasHttps = false;
}
```

## Obtenção do Local Storage e Domíniop de Terceira Parte

Essas informações são obtidas de maneira mais fácil por meio do arquivo `popup.js`, dado que ele consegue ter acesso diretamente aos elementos da página aberta, e ao local storage dela. Assim, foi feito uma função que, ao receber menssagens por meio do browser, devolve as informações necessárias, para que sejam adicionadas no HTML:

```javaScript
browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.method === "localStorage") {
    sendResponse({
      data: Object.entries(localStorage),
    });
  } else if (request.method === "thirdPartyDomains") {
    sendResponse({
      data: Object.entries(getExternalLinks()),
    });
  }

  return true;
});
```

Assim, em `localStorage.js`, por meio do envio de mensagem para o browser, é possível obter o Local Storage da página:

```javaScript
const response = await browser.tabs.sendMessage(tab.id, {
    method: "localStorage",
});
```

O mesmo é feito para os Domínios de Terceira Parte em `thirdPartyDomains.js`:

```javaScript
const response = await browser.tabs.sendMessage(tab.id, {
    method: "thirdPartyDomains",
});
```

Nesse, a resposta recebida é a saída da seguinte função:

```javaScript
const getExternalLinks = () => {
  var urls = Array.prototype.map.call(
    document.querySelectorAll("link, img, script, iframe, source, embed"),
    (tag) => {
      return tag.href || tag.src;
    }
  );

  const data = {
    urls: urls,
    length: urls.length,
  };

  return data;
};
```

A qual, basicamente, obtém todos os links presentes no HTML da página, que possuem referências a outras páginas (links, imagens, scripts, iframes, fontes e páginas embedadas).

## Cálculo do Score da Página

Para determinar a porcentagem de perigo de uma página (0 a 100%), o plugin utiliza a seguinte medologia:

- Se não possui proteção HTTPs, automaticamente o perigo é de 100%
- Caso contrário, é feito o seguinte cálculo:

```javaScript
cookiesScore * 0.3 + localStorageScore * 0.6 + thirdPartyDomainsScore * 0.1;
```

Sendo cada Score desse, as quantidades obtida, limitado a 100. Partindo do princípio que, quantidade de dados locais é mais perigoso que a quantidade de cookies, que por sua vez é mais perigoso que os domínios de terceira Parte.

## Front End

Por fim, foi feito o arquivo `popup.css` para deixar o plugin mais bonito. A seguir, está um vídeo de demonstração.

https://youtu.be/9Rtnis1kJfo

## Referências

- Icon: https://www.cybersecuritycloudexpo.com/northamerica/
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
