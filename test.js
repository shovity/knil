const knil = require('.')

const m = knil({
    hash: 'hash',
})

const w1 = knil('http://103.147.34.87:8689')
const w2 = knil('http://103.147.34.87:8689#hash')

setTimeout(async () => {
    const nodes = await m.nodes()

    console.log(nodes.map(n => n.id))
}, 100)