# Consegna

Il compito si riassume nella creazione di un sito web dinamico in express che serva dei dati recuperati da una API esterna e li serva attraverso due tipi pagine:

1. Una lista di post (all’indirizzo / )
2. La pagina di un singolo post con i suoi commenti (all’ indirizzo /post/:id)

La sfida di questo compito sta nel recuperare i dati dei post da visualizzare nell’html da una API esterna servita pubblicamente all'indirizzo https://jsonplaceholder.typicode.com/

- la lista dei post si recupera con una chiamata in get all’indirizzo https://jsonplaceholder.typicode.com/posts
- la lista dei commenti di un post si recupera all’indirizzo https://jsonplaceholder.typicode.com/post/1/comments (al posto di 1 mettete l’id del post di cui state cercando i commenti)

Create un repository di GitHub in cui condividete il vostro codice e, chi volesse strafare, si senta libero di introdurre nel suo sito anche altri elementi presi da jsonplaceholder come ad esempio gli users, gli album o le foto.

Suggerimenti:

- Per creare una route dinamica in cui possiate inserire un valore variabile per l’id del post guardare questo esempio tratto dalla documentazione di express:
https://expressjs.com/en/5x/api.html#req

- Per fare le richieste all’api di {JSON} Placeholder utilizzate la libreria node-fetch (https://www.npmjs.com/package/node-fetch) e utilizzatela esattamente come da esempio riportato sul sito https://jsonplaceholder.typicode.com/ nella sezione Try it.