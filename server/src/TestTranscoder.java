import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.String;
import java.util.ArrayList;

public class TestTranscoder {

    private enum aspectRatio {
        LAND_SCAPE(1.78),

        PORTRAIT(1.33);

        private double mFactor;

        aspectRatio (double factor) {
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

    public String getName () {
        return "TestTranscoder";
    }

    private void openFD (String path, String imgName, String type) throws IOException{
        mPath = path;
        mCurrImg = imgName;
        mFile = new File(mPath + mCurrImg + "."+type);
    }

    public void mux (String path, String imgName, String type, String toType) throws IOException {
        this.openFD(path, imgName, type);
        BufferedImage iBuff = ImageIO.read(mFile);
        ImageIO.write(iBuff, type, new File(mPath + mCurrImg + "." + toType));
    }

    public String getFilePath () throws IOException{
        return mFile.getCanonicalPath();
    }

    public boolean getUseCache() {
        return ImageIO.getUseCache();
    }

    public void scale (int height, aspectRatio ar) {

        int currHeight = mImageBuffer.getHeight();
        if (height > currHeight) {
           throw new RuntimeException("Scaling up not supported");
        }

        mImageScaleBuffer = new BufferedImage(height, ar.getWidth(height), mImageBuffer.getType());
        Graphics2D g = mImageScaleBuffer.createGraphics();

        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        g.drawImage(mImageBuffer, 0, 0,
                height, ar.getWidth(height),
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
    }

    public void runScaleMult () throws IOException{
        this.loadImage();
        //scale the png
        this.transcode("png");

        long st = System.currentTimeMillis();
        this.scale(350, aspectRatio.LAND_SCAPE);
        long d = System.currentTimeMillis() - st;
        this.transcode("png");
        System.out.println("Scale image "+this.mCurrImg +" to landscape: " + d );
    }
}
