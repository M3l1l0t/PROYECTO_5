export function createTopbar({ left, center, right }) {
  const topbar = document.createElement("div")
  topbar.className = "topbar"

  if (left) {
    const leftBox = document.createElement("div")
    leftBox.className = "topbar-left"
    leftBox.append(left)
    topbar.append(leftBox)
  }

  if (center) {
    const centerBox = document.createElement("div")
    centerBox.className = "topbar-center"
    centerBox.append(center)
    topbar.append(centerBox)
  }

  if (right) {
    const rightBox = document.createElement("div")
    rightBox.className = "topbar-right"
    rightBox.append(right)
    topbar.append(rightBox)
  }

  return topbar
}