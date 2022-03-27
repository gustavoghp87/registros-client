export type typeStatistic = {
    count: number
    countContesto: number
    countNoContesto: number
    countDejarCarta: number
    countNoLlamar: number
    countNoAbonado: number
    libres: number
}

export interface typeLocalStatistic extends typeStatistic {
    territorio: string
}
