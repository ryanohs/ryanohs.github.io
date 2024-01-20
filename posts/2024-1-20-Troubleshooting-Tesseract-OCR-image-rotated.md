---
layout: post
title: Troubleshooting Tesseract OCR (image rotated)
---

I'm trying to extract the text of documents I photographed with my phone. The photos looked correctly oriented on my phone and in Preview, but when I processed them with Tesseract, the output was junk. I determined the reason for this was the orientation EXIF metadata and found a solution to orient the photos.

[Tesseract](https://github.com/tesseract-ocr/tesseract) is an open-source OCR engine. On Mac OS you can install it with homebrew.

    brew install tesseract

Given an image from your phone, open a Terminal to the directory with your photo. Run this command to extract the text:

    tesseract test.jpg test

This will output a file `test.txt` containing the extracted text. In my case the file looked like this:

    ‘od 3g ‘(Jaq 39 ‘suedns 39) “qued
    BZ “pos 8UI96Z “JOY? BUI9 ‘(ae
    "yes By) 32} 80 “22 p97 ONIAUAS L
    *sBuiddo} pue I]IYD au] YIM aAsas *z
    *SUO!DAJIP S.JauN}DejNUeW OF
    Bulpsodze sayjem axeg ‘pauaysiou!

Clearly something went wrong!

Tesseract does some preprocessing on the image before OCR-ing it. There is an option to export the processed image. Create a config file in your working directory.

    echo 'tessedit_write_images true' > config

Then you can pass the config file as an extra parameter:

    tesseract test.jpg test config

This will output a file `test.processed.tif`. When I opened this file, it was sideways!

First, in Preview I tried rotating the image 4 times and then saving it. Tesseract correctly processed the file.

To automate fixing the orientation, I installed the ImageMagick tools.

    brew install imagemagick

Then I utilized the auto-orient option. This overwrites the file in place.

    magick mogrify -auto-orient test.jpg

If you inspect the EXIF data in Preview (Tools > Inspector > General), you should find Orientation set to 1 (Normal).

Now you can rerun Tesseract and it will extract the text correctly.