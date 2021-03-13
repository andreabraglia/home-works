const argv = require("simple-argv")
const faker = require("faker")

const W = argv.W || 6,
  H = argv.H || 6,
  S = argv.S || 6

module.exports = {
  H,
  W,
  S,
  field: [],
  ships: [],
  teams: {},
  seeder: () => {
    const field = module.exports.field
    const ships = module.exports.ships

    for (let y = 0; y < H; y++) {
      const row = []
      for (let x = 0; x < W; x++) {
        row.push({
          team: null,
          x,
          y,
          ship: null,
          hit: false
        })
      }
      field.push(row)
    }

    let id = 1
    for (let i = 0; i < S; i++) {
      const maxHp = faker.random.number({ min: 1, max: 6 })
      const vertical = faker.random.boolean()

      const ship = {
        id,
        name: faker.name.firstName(),
        x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
        y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
        vertical,
        maxHp,
        curHp: 4,
        alive: true,
        killer: null
      }

      let found = false
      for (let e = 0; e < ship.maxHp; e++) {
        const x = ship.vertical ? ship.x : ship.x + e
        const y = ship.vertical ? ship.y + e : ship.y
        if (field[y][x].ship) {
          found = true
          break
        }
      }

      if (!found) {
        for (let e = 0; e < ship.maxHp; e++) {
          const x = ship.vertical ? ship.x : ship.x + e
          const y = ship.vertical ? ship.y + e : ship.y
          field[y][x].ship = ship
        }

        ships.push(ship)
        id ++
      }
    }

  },
  PORT: argv.port || 8080,
  ipBlackList: []
}
