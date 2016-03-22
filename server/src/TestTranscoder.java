import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.String;
import java.util.ArrayList;

public class TestTranscoder {

    private enum ASPECT_RATIO {
        LAND_SCAPE(1.78),

        PORTRAIT(1.33);

        private double mFactor;

        ASPECT_RATIO (double factor) {
            mFactor = factor;
        }

        public double getAspectRatio () {
            return mFactor;
        }

        public int getWidth (int height) {
            return (int)getAspectRatio() * height;
        }

        public int getHeight(int width) {
            return width / (int)getAspectRatio();
        }
    }

    private BufferedImage mImageBuffer;
    private BufferedImage mImageScaleBuffer;
    private String mCurrImg;
    private String mPath;

    private File mFile;

    public TestTranscoder () {

    }

    public static String test () {
        ArrayList <String>l = new ArrayList<String>();
        l.add("Name");
        l.add("test");

        return "Hello Test";
    }

    public File getFile() {
        return mFile;
    }

    public String getName () {
        return "TestTranscoder";
    }

    public void mux (String path, String imgName, String type, String toType) throws IOException {
        this.openFD(path, imgName, type);
        this.loadImage();
        this.transcode(toType);
    }

    public void openFD (String path, String imgName, String type) throws IOException{
        mPath = path;
        mCurrImg = imgName;
        mFile = new File(mPath + mCurrImg + "."+type);
    }

    public String getFilePath () throws IOException{
        return mFile.getCanonicalPath();
    }

    public String [] getReaderMimeTypes () {
        return ImageIO.getReaderMIMETypes();
    }

    public boolean getUseCache() {
        return ImageIO.getUseCache();
    }

    public void loadImage () throws IOException {
        mImageBuffer = ImageIO.read(mFile);

        throw new IOException("Done loadImage() done returning Exception ....... ");
    }

    public void transcode(String type) throws IOException {
        ImageIO.write(mImageBuffer, type, new File(mPath + mCurrImg + "." + type));
    }

    public void scale (int height, ASPECT_RATIO aspectRatio) {

        int currHeight = mImageBuffer.getHeight();
        if (height > currHeight) {
           throw new RuntimeException("Scaling up not supported");
        }

        mImageScaleBuffer = new BufferedImage(height, aspectRatio.getWidth(height), mImageBuffer.getType());
        Graphics2D g = mImageScaleBuffer.createGraphics();

        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        g.drawImage(mImageBuffer, 0, 0,
                height, aspectRatio.getWidth(height),
                0 , 0,
                mImageBuffer.getWidth(), height,
                null);

        g.dispose();
    }

    public long run (int sample) throws IOException {
        long st;
        long [] stat = new long [sample];
        long avg = 0;

        for (int i = 0; i < sample; i++) {
            st = System.currentTimeMillis();
            this.transcode("png");
            long d = System.currentTimeMillis() - st;
            stat[i] = d;
            avg += d;
        }

        long _res = avg / sample;
        System.out.println("Transcoding image " + this.mCurrImg +" to lossless: " + _res );
        return _res;
    }

    public String getUserDir () {
        return System.getProperty("user.dir");
    }

    public void runMult (int sampleSize) throws IOException {
        ///Users/Dlimbu/Sites/mobileCloudServer/server/xLarge.jpg
//        this.loadImage("img/","xLarge","jpg");
//        this.run(sampleSize);
        System.out.println(System.getProperty("user.dir"));
        this.openFD("../../mobileCloudServer/server/","xLarge","jpg");
//        mux("../mobileCloudServer/server/","xLarge","jpg", "png");
        System.out.println("path: "+ this.getFilePath());
        this.loadImage();
//        System.out.println("Going to run smaple");
        this.run(sampleSize);

//        this.loadImage("Users/Dlimbu/Sites/mobileCloudServer/server/","xLarge","jpg");
//        this.run(sampleSize);
    }

    public void runScaleMult () throws IOException{
        this.loadImage();
        //scale the png
        this.transcode("png");

        long st = System.currentTimeMillis();
        this.scale(350, ASPECT_RATIO.LAND_SCAPE);
        long d = System.currentTimeMillis() - st;
        this.transcode("png");
        System.out.println("Scale image "+this.mCurrImg +" to landscape: " + d );
    }
}
