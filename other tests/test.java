public class test {
        public static void div3or5 (int testvar) {
            String thing = "";
            if (testvar % 3 == 0) {
                thing = thing + "3";
            } if (testvar % 5 == 0) {
                thing = thing + "5";
            } if (testvar % 3 != 0 && testvar % 5 != 0) {
                thing = thing + "None";
            }
}
    public static void main(String[] args){
        div3or5(15);
    }
}