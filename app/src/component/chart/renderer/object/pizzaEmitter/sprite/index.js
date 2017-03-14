import {paint}  from './paint'

export const createPool = ( tileSize: number, n: number ) : HTMLCanvasElement => {

    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = tileSize*n

    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    ctx.save()
    ctx.scale( tileSize/100, tileSize/100 )

    for( let x=n; x--; )
    for( let y=n; y--; ){
        ctx.save()
        ctx.translate( 100*x, 100*y )

        paint( ctx )

        ctx.restore()
    }

    return canvas
}