class source:
    dictionaryapi = "dictionaryapi"
    google = "google"
    ecdict = "ecdict"
    PyDictionary = "PyDictionary"


class defaultUserValue:
    glossaryBookName = 'mybook'
    exerciseBook = 'mybook'
    language = 'zh-CN'
    searchSource = source.ecdict
    definitionSources = source.ecdict + ',' + source.PyDictionary + ',' + source.dictionaryapi  + ',' + source.google 


allSources = [attr for attr in dir(source) if not callable(getattr(source, attr)) and not attr.startswith("__")]