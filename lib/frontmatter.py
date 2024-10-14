import os
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime

def walker(root):
    if os.path.isfile(root):
        dirname, basename = os.path.split(root)
        yield dirname, [], [basename]
    else:
        for path, dirnames, filenames in os.walk(root):
            yield path, dirnames, filenames

# Dumb and lazy header scan
@dataclass
class FileFlags:
    foundHeaderStart: bool = False # Flag when finding first '---' of the yaml header
    foundHeaderEnd: bool = False # Flag when found the second '---' of the yaml header.
    hasPublishDate: bool = False # Flag if the yaml config contains a publish date
    isPublishStatus: bool = False      # Flag to check the yaml config 'status:' if it's out of a draft state.
    indexes: list[int] = field(default_factory=list)           # List of line numbers {'header start, header end}


if __name__ == '__main__':
    # Doing a directory walk on the content folder.
    for path, dirnames, filenames in walker('../content'):
      for filename in filenames:
        if(filename[-4:] == '.mdx'):
          loc = (path + "/" + filename)
          mdxFileRead = open(loc, "r")

          contents = None
          flags = FileFlags()
          lineCount = 0
          
          # First pass is just scanning the yaml header
          for line in mdxFileRead:
            # Start of the header check
            if('---' in line and not flags.foundHeaderStart):
              flags.indexes.append(lineCount)
              flags.foundHeaderStart = True
              continue
            # End of the header check - Terminates loop & resets iteration, mdxFileRead.seek(0)
            elif('---' in line and flags.foundHeaderStart and not flags.foundHeaderEnd):
              flags.indexes.append(lineCount)
              flags.foundHeaderEnd = True
              print(flags.indexes)
              mdxFileRead.seek(0) # Placing index back to 0
              break # Ending the frontmatter header search
            elif('publish:' in line):
              flags.foundPublishDate = True # Found a publish date in the header.
            elif('status:' in line and ('publish' or 'hide' in line)):
              flags.isPublishStatus = True # Found a status of 'publish' or 'hide'. 

            lineCount += 1
          # End - for line in mdxFile:
          

         
          # Appending the publish date to the first available line
          if(flags.isPublishStatus and not flags.hasPublishDate):
            print("hi")
            contents = mdxFileRead.readlines()
            ts = datetime.today().strftime("'%Y-%m-%d'") 
            contents.insert(1, '\npublish: ' + ts + "\n")

            mdxFileRead.close()
            mdxFileWrite = open(loc, "w")
            mdxFileWrite.writelines(contents)
            mdxFileWrite.close()

          else:
            # Closing file
            mdxFileRead.close()


          
          

