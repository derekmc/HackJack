#!/usr/bin/env bash

# This static site generator script is designed to work well with Github Pages,
# in that the generated files are stored in the top level directory for the project
# so that they can be commmitted and uploaded to a github pages site directly.

# rm -r output/*

# Generate HTML files
echo "Generating HTML files"

find content/ -type f -name "*.md" |
  sed -e 's/content\/\(.*\)\.md/\0 ..\/\1.html/g' |
  while read infile outfile; do
    echo "$infile to $outfile"
    #./md2html $infile > $outfile;
    ./md2html $infile | cat template/header.html - template/footer.html > $outfile
done

# Generate Index Page
#echo
#echo "Generating Index Page"
#echo "../index.html"

# overwrite
#cat template/indexheader.html > ../index.html

#echo
#echo "Adding Index Links"

#find content/ -type f -name "*.md" |
  #sed -e 's/content\/\(.*\)\.md/\0 \1.html/g' |
  #while read filename pageref; do
    ## echo "Page Ref: ${pageref}"
    ## echo "Filename: ${filename}"
    #firstline=$(head -n 1 "$filename")
    #pagetitle="${firstline:2}"
    #echo "\"$pagetitle\""
    ## echo "Page Title: ${pagetitle}"
    #cat template/index.html | sed "s/\${title}/$pagetitle/g;s/\${href}/\.\/$pageref/g" >> ../index.html
#done

#cat template/indexfooter.html >> ../index.html

echo
echo "Static site generation finished."
echo
