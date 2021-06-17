Para facilitar o entendimento de como os endpoints devem se comportar, criamos uma API de exemplo, e deixamos disponível para vocês.

A URL base da API é: 
```https://desafio-backend-m02.herokuapp.com/```

Mas tem um detalhe, para que cada participante do desafio possa manipular os dados individualmente, criamos uma funcionalidade que irá separar os dados em um arquvo **JSON**, assim cada participante terá acesso ao seu próprio carrinho sem que outra pessoa manipule os dados.
Como funciona isso? Para usar a API é preciso passar em todos os endpoints (```GET``` , ```POST```, ```PUT```, ```DELETE```, ```PATCH```) um parâmetro denominado: **usuario**, veja abaixo no endpoint de listar produtos como você deve utilizar:

![](https://i.imgur.com/a4tbOHb.jpg)

Lembre-se, você deve utilizar esse parâmetro para **todos** os endpoints e o usuário deve ser sempre o mesmo informado em todos os seus endpoints, pois é por meio dele que iremos dar acesso exclusivo aos seus dados.

Uma sugestão é que você utilize o seu usuário do **GITHUB**, assim ficará fácil de você se lembrar qual usuário você usou.