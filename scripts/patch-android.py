import re,pathlib
root=pathlib.Path('android/app/src/main')
# 1) tema: fullscreen + tampil sampai area notch
st=root/'res/values/styles.xml';t=st.read_text()
extra='''<item name="android:windowFullscreen">true</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
        <item name="android:windowBackground">@android:color/black</item>'''
t=re.sub(r'(<style name="AppTheme.NoActionBar"[^>]*>)',lambda m:m.group(1)+'\n        '+extra,t,1)
st.write_text(t)
# 2) mode immersive (sembunyikan status & navigation bar)
f=next(root.glob('java/**/MainActivity.java'));pkg=re.search(r'package ([\w.]+);',f.read_text()).group(1)
f.write_text(f'''package {pkg};

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {{
    @Override
    public void onCreate(Bundle b) {{ super.onCreate(b); hide(); }}
    @Override
    public void onWindowFocusChanged(boolean focus) {{ super.onWindowFocusChanged(focus); if (focus) hide(); }}
    private void hide() {{
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        c.hide(WindowInsetsCompat.Type.systemBars());
    }}
}}
''')
