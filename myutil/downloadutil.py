from django.http import HttpResponse
def createFileDownloadResponse(filename=None, contents=None):
    from myutil import fileutil    
    raw = contents or  fileutil.contentsOfFile( filename )
    hr = HttpResponse(raw, content_type="application/raw")
    hr.set_cookie("fileDownload", "true", path="/")
    return hr