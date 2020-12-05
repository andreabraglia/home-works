const e = module.exports
e.build = (html, vars = {}) => {

  let Hv = html.match(/\[(.*?)\]/g)
  Hv = !Hv ? Hv : Hv
    .map(e => e.slice(1, e.length - 1))

  // TODO find better regex than this /{{([\S\s]*)}}/g
  let Hl = html.match(/{{([\S\s]*)}}/g)
  Hl = !Hl ?
    Hl
    :
    Hl
      .reduce((acc, e) => {
        const parsed = e.replace(/ /g, "").replace(/\n/g, "")
        let v = parsed.match(/!(.*?)!/g)
        v = v[0].slice(1, v[0].length - 1)
        console.log(v, v.length)
        const innerHtml = parsed.slice(v.length + 4, parsed.length - 2)

        acc.push({
          v,
          innerHtml,
          e: e.replace(/\n/g, "")
        })
        return acc
      }, [])

  Hv.forEach(e => html = html.replace(`[${e}]`, vars[e] || "").replace(/\n/g, ""))

  Hl.forEach(({ v, innerHtml, e }) => {
    if (vars[v]) {
      const parsedHtml = vars[v].map(val =>  innerHtml.replace("#value", val)).join("")
      html =  html.replace(e, parsedHtml)
    } else {
      html = html.replace(e, "")
    }
  })

  // console.log({ Hv, html })

  html = html.replace("<!--  -->", "")

  return html
}

e.nomi = [
  "Amolpreet",
  "Amos",
  "Amrinder",
  "Amrit",
  "Amro",
  "Anay",
  "Andrea",
  "Andreas",
  "Andrei",
  "Andrejs",
  "Andrew",
  "Andy",
  "Anees",
  "Anesu",
  "Angel",
  "Angelo",
  "Angus",
  "Anir",
  "Anis",
  "Anish",
  "Anmolpreet",
  "Annan",
  "Anndra",
  "Anselm",
  "Anthony",
  "Anthony-John",
  "Antoine",
  "Anton",
  "Antoni",
  "Antonio",
  "Antony",
  "Antonyo",
  "Anubhav",
  "Aodhan",
  "Aon",
  "Aonghu"
]