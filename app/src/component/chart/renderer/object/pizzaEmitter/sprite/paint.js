
type Point = [ number, number ]

const path = ( ctx: CanvasRenderingContext2D, arr: Array<Point> ) => {
    ctx.moveTo( arr[ 0 ][0], arr[ 0 ][1] )
    for( let i=arr.length; i--; )
        ctx.lineTo( arr[i][0], arr[i][1] )
}


// draw a 100x100 pizza
export const paint = ( ctx: CanvasRenderingContext2D ) => {

    const color_crust           = '#b58a1c'
    const color_base            = '#df8d34'

    const keys = [

        // crust

        // up crust
        [7 , 20],
        [33, 7 ],
        [66, 7 ],
        [95, 20],

        // down crust
        [91, 30],
        [66, 18],
        [33, 18],
        [10, 30],

        // cone
        [80, 45],
        [68, 70],
        [50, 98],
        [32, 70],
        [20, 45],

        // pepperony
        [34, 37],
        [57, 87],
        [67, 57],

        // vegetable
        [39, 26],
        [64, 29],
        [37, 84],
        [47, 67],
    ]
        .map( ([x,y]) => [
            x + ( Math.random() - 0.5 ) * 12,
            y + ( Math.random() - 0.5 ) * 12,
        ])


    const m = [
        ...keys.slice(0,4).map( (a,i) => [ (a[0]+keys[7-i][0])/2, (a[1]+keys[7-i][1])/2 ] ),
        ...keys.slice(8,13),
    ]

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, [
        m[6],
        ...[ ...m.slice(6,9), m[0] ].map( a => [ a[0]-5, a[1] ] ),
        keys[0],
        [50,20],
    ])

    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle=color_base
    path( ctx, m )
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    path( ctx, m )
    ctx.clip()

    const r_pepperoni = Math.random()*70 + 335
    const r_vege      = Math.random()*120 + 45


    {
        const radius = Math.random() * 5 + 10
        const color_pepperoniShadow = `hsl(${r_pepperoni},80%,30%)`
        const color_pepperoni       = `hsl(${r_pepperoni},90%,35%)`
        keys.slice(-7,-4).forEach( ([x,y]) => {

            ctx.beginPath()
            ctx.fillStyle=color_pepperoniShadow
            ctx.arc( x-3, y, radius+0.5 , 0, Math.PI*2 )
            ctx.fill()
            ctx.beginPath()
            ctx.fillStyle=color_pepperoni
            ctx.arc( x, y, radius , 0, Math.PI*2 )
            ctx.fill()

        })
    }

    {
        const radius = Math.random() * 8 + 5
        const color_vegeShadow = `hsl(${r_vege},85%,30%)`
        const color_vege       = `hsl(${r_vege},95%,35%)`
        keys.slice(-4).forEach( ([x,y]) => {

            const u=Math.random()*6

            ctx.beginPath()
            ctx.fillStyle=color_vegeShadow
            ctx.arc( x-3, y, radius+0.5 , u, u+Math.PI )
            ctx.fill()
            ctx.beginPath()
            ctx.fillStyle=color_vege
            ctx.arc( x, y, radius , u, u+Math.PI )
            ctx.fill()

        })
    }


    ctx.restore()

    ctx.beginPath()
    ctx.fillStyle=color_crust
    path( ctx, keys.slice(0,8) )
    ctx.fill()


    ctx.beginPath()
    ctx.lineCap='round'
    ctx.strokeStyle='#000'
    path( ctx, [
        ...keys.slice(0,4),
        m[3],
        ...keys.slice(8,11),
        ...[ ...m.slice(6,9), m[0] ].map( a => [ a[0]-5, a[1] ] ),
        keys[0],
    ])
    ctx.lineWidth=1.5
    ctx.stroke()

}