import { createCanvas } from 'canvas'
import fs from 'fs'

const canvas = createCanvas(1200, 630)
const context = canvas.getContext('2d')

context.fillStyle = '#000'
context.fillRect(0, 0, 1200, 630)

context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.textBaseline = 'top'
context.fillStyle = '#3574d4'

const text = 'Hello, World!'

const textWidth = context.measureText(text).width
context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
context.fillStyle = '#fff'
context.fillText(text, 600, 170)

context.fillStyle = '#fff'
context.font = 'bold 30pt Menlo'
context.fillText('flaviocopes.com', 600, 530)

const buffer = canvas.toBuffer('image/png')
fs.writeFileSync('output.png', buffer)
