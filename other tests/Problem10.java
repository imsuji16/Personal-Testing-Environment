public class Problem10 {
    public static class Vector {
        public double x;
        public double y;
        public double z;

        public Vector(double x, double y, double z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public double getX() {
            return this.x;
        }

        public double getY() {
            return this.y;
        }
        
        public double getZ() {
            return this.z;
        }

        public Vector addVector(Vector other) {
            double x = this.x + other.x;
            double y = this.y + other.y;
            double z = this.z + other.z;
            Vector out = new Vector(x, y, z);
            return out;
        }

        public Vector multiplyVector(Vector other) {
            double x = this.x * other.x;
            double y = this.y * other.y;
            double z = this.z * other.z;
            Vector out = new Vector(x, y, z);
            return out;
        }

        public double getNorm() {
            double norm = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
            return norm;
        }

        public boolean equals(Vector other) {
            if (this.x == other.x && this.y == other.y && this.z == other.z) {
                return true;
            } else {
                return false;
            }
        }
    }
}
