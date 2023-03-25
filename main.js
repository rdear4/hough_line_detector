let originalImg = undefined
let greyScaleImage, blurred = undefined
function preload() {
    originalImg = loadImage("lines.jpg")


    loadImage('greyscale.png', (img) => {
        greyScaleImage = img
        console.log("Greyscale image found!")
    }, (err) => console.log(err))

    loadImage('blurred.png', (img) => {
        blurred = img
        console.log("Blurred image found!")
    }, (err) => console.log(err))


}

function setup() {
    createCanvas(4 * originalImg.width, 4 * originalImg.height);
    background(0)


    // for (let row of imgData.dataString.split("\n")) {
    //     imgData.data.push(row.split(" ").map((e, i) => parseInt(e)))
    // }

    // let img = createImage(imgData.size.width, imgData.size.height)
    // img.loadPixels()

    // for (let x = 0; x < img.width; x++) {
    //     for (let y = 0; y < img.height; y++) {
    //         colorData = imgData.data[(x * img.width) + y]
    //         img.set(x, y, color(colorData[0], colorData[1], colorData[2]))

    //     }
    // }
    // img.updatePixels()

    image(originalImg, 0, 0)
    originalImg.loadPixels()

}

const createGreyscale = (img) => {


    gsImg = createImage(img.width, img.height)

    gsImg.loadPixels()


    let lastY, lastX = 0

    for (let y = 0; y < img.height; y++) {

        for (let x = 0; x < img.width; x++) {
            let pixelIndex = (x + (y * img.width)) * 4



            avgIntensity = (img.pixels[pixelIndex] + img.pixels[pixelIndex + 1] + img.pixels[pixelIndex + 2]) / 3

            gsImg.set(x, y, color(avgIntensity))


            lastX = x
        }
        lastY = y
    }


    gsImg.updatePixels()
    return gsImg
}

const gausianBlur = (img) => {
    img.loadPixels()

    let kernel = [
        [1, 4, 7, 4, 1],
        [4, 16, 26, 16, 4],
        [7, 26, 41, 26, 7],
        [4, 16, 26, 16, 4],
        [1, 4, 7, 4, 1]
    ]
    let halfKernelWidth = Math.floor(kernel.length / 2)
    let kernelSum = 0
    for (let i = 0; i < kernel.length; i++) {
        for (let j = 0; j < kernel.length; j++) {
            kernelSum += kernel[i][j]
        }
    }



    let cImg = createImage(img.width, img.height)
    cImg.loadPixels()

    for (let y = halfKernelWidth; y < img.height - halfKernelWidth; y++) {
        for (let x = halfKernelWidth; x < img.width - halfKernelWidth; x++) {

            let val = 0
            for (let i = 0; i < kernel.length; i++) {
                for (let j = 0; j < kernel.length; j++) {
                    // console.log(x - 1 + 1, y - 1 + j, sobel[i][j])
                    // console.log()
                    val += kernel[i][j] * img.get(x - halfKernelWidth + i, y - halfKernelWidth + j)[0]
                }
            }

            cImg.set(x, y, color(val / kernelSum))
            // console.log(val)
        }

    }
    cImg.updatePixels()

    return cImg

}

const convolute = (img, kernel) => {


    img.loadPixels()

    // let kernel = [
    //     [1, 4, 7, 4, 1],
    //     [4, 16, 26, 16, 4],
    //     [7, 26, 41, 26, 7],
    //     [4, 16, 26, 16, 4],
    //     [1, 4, 7, 4, 1]
    // ]
    let halfKernelWidth = Math.floor(kernel.length / 2)
    let kernelSum = 0
    for (let i = 0; i < kernel.length; i++) {
        for (let j = 0; j < kernel.length; j++) {
            kernelSum += kernel[i][j]
        }
    }



    let cImg = createImage(img.width, img.height)
    cImg.loadPixels()

    for (let y = halfKernelWidth; y < img.height - halfKernelWidth; y++) {
        for (let x = halfKernelWidth; x < img.width - halfKernelWidth; x++) {

            let val = 0
            for (let i = 0; i < kernel.length; i++) {
                for (let j = 0; j < kernel.length; j++) {
                    // console.log(x - 1 + 1, y - 1 + j, sobel[i][j])
                    // console.log()
                    val += kernel[i][j] * img.get(x - halfKernelWidth + i, y - halfKernelWidth + j)[0]
                }
            }

            cImg.set(x, y, color(val / kernelSum))
            // console.log(val)
        }

    }
    //Pad the top and bottom
    cImg.updatePixels()
    for (let y = 0; y < halfKernelWidth; y++) {
        for (let x = 0; x < img.width; x++) {
            cImg.set(x, y, cImg.get(x, y + 5)[0])
        }
    }
    cImg.updatePixels()
    for (let y = cImg.height - halfKernelWidth; y < cImg.height; y++) {
        for (let x = 0; x < img.width; x++) {
            cImg.set(x, y, cImg.get(x, y - 5)[0])
        }
    }
    cImg.updatePixels()
    for (let y = 0; y < cImg.height; y++) {
        for (let x = 0; x < halfKernelWidth; x++) {
            cImg.set(x, y, cImg.get(x + 5, y)[0])
        }
    }
    cImg.updatePixels()
    for (let y = 0; y < cImg.height; y++) {
        for (let x = cImg.width - halfKernelWidth; x < cImg.width; x++) {
            cImg.set(x, y, cImg.get(x - 5, y)[0])
        }
    }

    cImg.updatePixels()

    return cImg

}

const sobelX = (img) => {
    img.loadPixels()


    let sobel = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ]

    let xVals = new Array(img.width).fill(0)

    for (let index in xVals) {
        xVals[index] = new Array(img.height).fill(0)
    }

    let xEdgeImage = createImage(img.width, img.height)
    xEdgeImage.loadPixels()

    for (let y = 2; y < img.height - 2; y++) {
        for (let x = 2; x < img.width - 2; x++) {

            let val = 0
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // console.log(x - 1 + 1, y - 1 + j, sobel[i][j])
                    // console.log()
                    val += sobel[j][i] * img.get(x - 1 + i, y - 1 + j)[0]
                }
            }

            xEdgeImage.set(x, y, color(val / 4 + 128))

            xVals[x][y] = val
            // console.log(val)
        }

    }
    xEdgeImage.updatePixels()

    return [xEdgeImage, xVals]
}

const sobelY = (img) => {
    img.loadPixels()


    let sobel = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
    ]

    let yVals = new Array(img.width).fill(0)

    for (let index in yVals) {
        yVals[index] = new Array(img.height).fill(0)
    }

    let xEdgeImage = createImage(img.width, img.height)
    xEdgeImage.loadPixels()

    for (let y = 2; y < img.height - 2; y++) {
        for (let x = 2; x < img.width - 2; x++) {

            let val = 0
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // console.log(x - 1 + 1, y - 1 + j, sobel[i][j])
                    // console.log()
                    val += sobel[j][i] * img.get(x - 1 + i, y - 1 + j)[0]
                }
            }

            xEdgeImage.set(x, y, color(val / 4 + 128))
            yVals[x][y] = val

        }

    }
    xEdgeImage.updatePixels()

    return [xEdgeImage, yVals]
}

const combineSobel = (im1, im2, threshold = 100) => {

    im1.loadPixels()
    im2.loadPixels()

    resIm = createImage(originalImg.width, originalImg.height)

    for (let y = 0; y < im1.height; y++) {
        for (let x = 0; x < originalImg.width; x++) {
            let c1 = (im1.get(x, y)[0])
            let c2 = (im2.get(x, y)[0])
            let newVal = ((c1 - c2))

            resIm.set(x, y, color(0, 255, 0, Math.abs(newVal) > threshold ? 255 : 0))
        }
    }

    resIm.updatePixels()

    return resIm


}

const determineGradient = (combined, xVals, yVals) => {
    combined.loadPixels()

    let retIm = createImage(combined.width, combined.height)
    retIm.loadPixels()

    let gradientArray = []
    push()
    colorMode(HSB, 2 * Math.PI)
    for (let y = 0; y < yVals.length; y++) {
        for (let x = 0; x < xVals.length; x++) {

            if (combined.get(x, y)[1] == 255) {

                //Calc Gradient
                // console.log(yVals[x][y], xVals[x][y])
                let tempTheta = Math.atan(yVals[x][y] / xVals[x][y])
                let hue = xVals[x][y] > 0 ? (tempTheta + (2 * Math.PI)) % (2 * Math.PI) : Math.PI + tempTheta;
                retIm.set(x, y, color(hue + Math.PI / 2, 2 * Math.PI, 2 * Math.PI))

            }

        }
    }
    pop()

    retIm.updatePixels()

    return [retIm]
}

const setupAccumulator = () => {

    let accArr = new Array(180).fill(0)
    for (let index in accArr) {
        accArr[index] = new Array(2 * originalImg.height).fill(0)
    }

    return accArr

}

const findLines = (img, acc) => {

    img.loadPixels()
    let mins = []
    let maxs = []
    for (let x = 0; x < img.width; x++) {
        let rhos = []
        for (let y = 0; y < img.height; y++) {

            if (img.get(x, y)[1] == 255) {

                for (let t = 0; t < acc.length; t++) {

                    // let rho = 
                    let rho = (-(x * Math.sin(t * Math.PI / 180)) + (y * Math.cos(t * Math.PI / 180)))
                    let rhoAdjusted = Math.floor(rho) + Math.floor(originalImg.height / 2);
                    acc[t][rhoAdjusted]++
                    // console.log((2 * originalImg.height) <= (Math.floor(rho) + originalImg.height))
                    // rhos.push(Math.floor(rho) + originalImg.height)
                    // console.log(`Theta: ${t} - Rho: ${Math.floor(rho) + originalImg.height}`)
                }

                // console.log("DONE!")
                // return

            }

        }
        // mins.push(Math.min(...rhos))
        // maxs.push(Math.max(...rhos))
        // rhos = []
    }

    // console.log(Math.min(...mins), Math.max(...maxs))


    return acc


}

const findMax = (acc) => {
    console.log(`Size: ${acc.length}x${acc[0].length}`)
    let maxValueInfo = { t: -1, r: -1, v: -1 }

    for (let theta in acc) {
        for (let rho in acc[theta]) {
            // console.log(`acc[${theta}][${rho}]`)
            try {
                if (acc[theta][rho] > maxValueInfo.v) {
                    maxValueInfo = { t: theta, r: rho, v: acc[theta][rho] }
                }
            } catch (e) {
                // console.log(`acc[${theta}][${rho}]`)
            }

        }
    }

    return maxValueInfo
}

const graphLine = (img) => {

    img.loadPixels()

    let retIm = createImage(img.width, img.height)


    retIm.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
    retIm.loadPixels()

    for (let x = 0; x < img.width; x++) {

        let y = Math.floor(.4244 * x + 190)
        console.log(x, y)
        retIm.set(x, y, color(0, 255, 0))

    }

    retIm.updatePixels()
    return retIm
}

function draw() {


    if (!greyScaleImage) {
        greyScaleImage = createGreyscale(originalImg)
        greyScaleImage.save('greyscale.png')
    }
    image(greyScaleImage, originalImg.width, 0)

    if (!blurred) {
        let gKernel = [
            [1, 4, 7, 4, 1],
            [4, 16, 26, 16, 4],
            [7, 26, 41, 26, 7],
            [4, 16, 26, 16, 4],
            [1, 4, 7, 4, 1]
        ]
        // blurred = gausianBlur(greyScaleImage)
        blurred = convolute(greyScaleImage, gKernel)
        blurred.save('blurred', 'png')
    }
    image(blurred, 2 * originalImg.width, 0)

    let [xEdge, xVals] = sobelX(blurred)
    image(xEdge, 3 * originalImg.width, 0)

    let [yEdge, yVals] = sobelY(blurred)
    image(yEdge, 0, originalImg.height)

    let combinedSobel = combineSobel(xEdge, yEdge, 35)
    image(combinedSobel, originalImg.width, originalImg.height)

    //Determine Gradient
    let [gradArrayImg] = determineGradient(combinedSobel, xVals, yVals)
    image(gradArrayImg, 2 * originalImg.width, originalImg.height)

    let accumulator = setupAccumulator()

    let newAccumulator = findLines(combinedSobel, accumulator)

    console.log(findMax(newAccumulator))

    image(graphLine(originalImg), 3 * originalImg.width, originalImg.height)

    noLoop()

}