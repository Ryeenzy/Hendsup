package com.ryeenzyxnz.overlay;

import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/** Pemilih berkas (Storage Access Framework) tanpa izin khusus: Fragment tanpa tampilan yang menerima onActivityResult milik Activity Roblox. */
public final class RzFilePick extends Fragment {
    interface Cb { void done(Uri uri); }

    private static final int REQ = 0x52A1;
    private Intent intent;
    private Cb cb;

    public RzFilePick() { }

    static boolean open(Activity a, Cb cb) {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        return launch(a, i, cb);
    }

    static boolean create(Activity a, String name, Cb cb) {
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("application/octet-stream");
        i.putExtra(Intent.EXTRA_TITLE, name);
        return launch(a, i, cb);
    }

    private static boolean launch(Activity a, Intent i, Cb cb) {
        try {
            RzFilePick f = new RzFilePick();
            f.intent = i;
            f.cb = cb;
            a.getFragmentManager().beginTransaction().add(f, "rzpick").commitAllowingStateLoss();
            a.getFragmentManager().executePendingTransactions();
            f.startActivityForResult(i, REQ);
            return true;
        } catch (Throwable t) {
            android.util.Log.w("RYEENZYXNZ", "pemilih berkas gagal: " + t);
            return false;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQ) {
            Uri u = resultCode == Activity.RESULT_OK && data != null ? data.getData() : null;
            try { if (cb != null) cb.done(u); } catch (Throwable t) { android.util.Log.w("RYEENZYXNZ", "callback berkas: " + t); }
        }
        try { getFragmentManager().beginTransaction().remove(this).commitAllowingStateLoss(); } catch (Throwable ignore) { }
    }

    static String readText(Activity a, Uri u) throws java.io.IOException {
        InputStream in = a.getContentResolver().openInputStream(u);
        if (in == null) throw new java.io.IOException("tak bisa dibuka");
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n, total = 0;
        while ((n = in.read(buf)) > 0) { bo.write(buf, 0, n); total += n; if (total > 2_000_000) break; }
        in.close();
        return bo.toString("UTF-8");
    }

    static void writeText(Activity a, Uri u, String text) throws java.io.IOException {
        OutputStream o = a.getContentResolver().openOutputStream(u, "wt");
        if (o == null) throw new java.io.IOException("tak bisa ditulis");
        o.write(text.getBytes("UTF-8"));
        o.close();
    }
}
