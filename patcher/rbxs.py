"""RYEENZYXNZ - pembaca/penulis pack shader Roblox (magic 'RBXS').

Format (hasil bedah glsles3.pack Roblox 2.743, GLES3):
  0x00  'RBXS'
  0x0C  u16 jumlah nama program   (394)
  0x0E  u16 jumlah rekaman varian (2383)
  0x40  jumlah_nama * 68 byte : [20 byte meta][48 byte nama]
  ...   daftar string FFlag/flag fitur
  tabel rekaman (jumlah_rekaman * 64 byte) menempel tepat di depan data:
        [16 byte hash/kunci][u32 offset][u32 ukuran][40 byte lain]
  data  GLSL ES 3.00 mentah (#version 300 es ...), tiap rekaman = 1 shader

Penulisan ulang memindahkan data (panjang bebas) dan memperbarui offset/ukuran.
Yang TIDAK diubah: hash/kunci rekaman, nama, urutan tabel.
"""
import struct

MAGIC = b"RBXS"
REC = 64


class PackError(Exception):
    pass


class Pack:
    def __init__(self, raw):
        raw = bytes(raw)
        if raw[:4] != MAGIC:
            raise PackError("bukan pack RBXS")
        self.raw = raw
        self.n_names, self.n_recs = struct.unpack_from("<HH", raw, 12)
        if not (0 < self.n_recs < 100000):
            raise PackError("jumlah rekaman tidak masuk akal: %d" % self.n_recs)
        self.names = []
        for k in range(self.n_names):
            o = 64 + k * 68
            self.names.append(raw[o + 20:o + 68].split(b"\0")[0].decode("latin1"))
        offs = []
        # tabel berada tepat sebelum data: cari dengan mencoba start = data_pertama - n*64
        # data pertama = min offset; offset ada di kolom +16 tiap rekaman, jadi iterasi sederhana:
        # pakai fakta bahwa akhir tabel == awal data terkecil.
        first = self._guess_first_data()
        self.table = first - self.n_recs * REC
        self.recs = []  # (hash16, off, size, tail40)
        for i in range(self.n_recs):
            o = self.table + i * REC
            h = raw[o:o + 16]
            off, size = struct.unpack_from("<II", raw, o + 16)
            if size == 0 or off + size > len(raw) or off < first:
                raise PackError("rekaman %d rusak (off=%d size=%d)" % (i, off, size))
            self.recs.append((h, off, size, raw[o + 24:o + 64]))
            offs.append(off)
        if min(offs) != first:
            raise PackError("awal data tidak cocok dengan tabel")
        self.first = first

    def _guess_first_data(self):
        # data pertama diawali '#version'; tabel berakhir tepat di situ.
        i = self.raw.find(b"#version", 64)
        if i < 0:
            raise PackError("tidak ada #version")
        return i

    def source(self, i):
        _, off, size, _ = self.recs[i]
        return self.raw[off:off + size]

    def blobs(self):
        """(off,size) unik, urut offset (rekaman boleh berbagi data)."""
        return sorted({(r[1], r[2]) for r in self.recs})

    def rebuild(self, replace):
        """replace: dict {(off,size): bytes_baru}. Kembalikan bytes pack baru."""
        raw = self.raw
        out = bytearray(raw[:self.first])
        newpos = {}
        cur = self.first
        for off, size in self.blobs():
            if off > cur:  # celah antar blob: salin apa adanya
                out += raw[cur:off]
            data = replace.get((off, size), raw[off:off + size])
            newpos[(off, size)] = (len(out), len(data))
            out += data
            cur = off + size
        out += raw[cur:]  # ekor
        for i, (h, off, size, tail) in enumerate(self.recs):
            noff, nsize = newpos[(off, size)]
            o = self.table + i * REC
            struct.pack_into("<II", out, o + 16, noff, nsize)
        return bytes(out)


def is_rbxs(data):
    return data[:4] == MAGIC
