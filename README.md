# Metalsmith-benchmark for metalsmith-revision

Small performance test for metalsmith-revision package

---

The first will have the same perf with ou without the plugin.
![first_build](./first_build.png)

then if you change one file in my source file, metalsmith will only rebuild this file :
![one_file](./second_pass.png)

Of course if you changed a layout used by all the file, everything will be rebuild. This is usefull if you want to rebuild a few posts or a new post in a blog for example, or fix a typo :)

## Don't forget to add .clean(false) to your metalsmith build script :)
