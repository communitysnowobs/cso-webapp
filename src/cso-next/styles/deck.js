export const blueToOrange = [
  [1, 152, 189, 255],
  [73, 227, 206, 255],
  [216, 254, 181, 255],
  [254, 237, 177,255],
  [254, 173, 84, 255],
  [209, 55, 78, 255]
]

export const purpleToBlue = [
  [73, 160, 157, 255],
  [77, 136, 151, 255],
  [81, 113, 146, 255],
  [86, 90, 140, 255],
  [90, 67, 135, 255],
  [95, 44, 131, 255]
]

export const hexStyle_1 = {
  pickable: true,
  extruded: false,
  radius: 10000,
  coverage: 0.5,
  colorRange: purpleToBlue,
  elevationScale: 1,
}

export const hexStyle_2 = {
  pickable: true,
  extruded: true,
  radius: 10000,
  coverage: 0.15,
  colorRange: purpleToBlue,
  elevationScale: 100
}

export const squareStyle_2 = {
  pickable: true,
  extruded: false,
  cellSize: 12000,
  coverage: 0.25,
  colorRange: purpleToBlue,
  elevationScale: 60
}
