class Source:
    dictionaryapi = "dictionaryapi"
    google = "google"
    ecdict = "ecdict"
    PyDictionary = "PyDictionary"

class CustomSource:
    customDefinition = "customDefinition"
    customNote = "customNote"

class defaultUserValue:
    glossaryBookName = 'mybook'
    exerciseBook = 'mybook'
    language = 'zh-CN'
    searchSource = Source.ecdict
    definitionSources = Source.ecdict + ',' + Source.PyDictionary + ',' + Source.dictionaryapi  + ',' + Source.google


allSources = [attr for attr in dir(Source) if not callable(getattr(Source, attr)) and not attr.startswith("__")]
allCustomSources = [attr for attr in dir(CustomSource) if not callable(getattr(CustomSource, attr)) and not attr.startswith("__")]