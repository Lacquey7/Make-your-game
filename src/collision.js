export default class Collision {
  static checkCollision(object1, object2) {
    return object1.x < object2.x + 32 && object1.x + 32 > object2.x && object1.y < object2.y + 32 && object1.y + 32 > object2.y;
  }
}
