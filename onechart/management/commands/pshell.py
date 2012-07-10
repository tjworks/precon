from django.core.management.base import NoArgsCommand
from optparse import make_option
import os
import traceback
from etc.ec2 import *
from etc import ec2 as ec  
#from etc.scripts import db as dbtool


modules = "onechart.management.commands.pshell, onechart.models"

    
class Command(NoArgsCommand):
    option_list = NoArgsCommand.option_list + (
        make_option('--plain', action='store_true', dest='plain',
            help='Tells Django to use plain Python, not IPython.'),
        make_option('--no-pythonrc', action='store_true', dest='no_pythonrc',
            help='Tells Django to use plain Python, not IPython.'),
    )
    help = "Like the 'shell' command but autoloads the models of all installed Django apps."

    requires_model_validation = True

    def handle(self, *args, **options):
        objects = self._import_objects(modules.split(','))            
        print "------------------------------------"
        if args and len(args)>0:
            if args[0] in objects:
                objects[args[0]]()
            else:
                print "\n%s is not defined" %args[0]
            os._exit(0)
            
        print 'Starting gfshell args: %s options: %s' %(",".join(args), options)
        self._handle_noargs(options, objects)
          
    def _import_objects(self, modules):
        from django.db.models.loading import get_models, get_apps
        loaded_models = get_models()
        # Set up a dictionary to serve as the environment for the shell, so
        # that tab completion works on objects that are imported at runtime.
        # See ticket 5082.
        imported_objects = {}
       
        for app_mod in get_apps():
            app_models = get_models(app_mod)
            if not app_models:
                continue
            model_labels = ", ".join([model.__name__ for model in app_models])
            print self.style.SQL_COLTYPE("From '%s' autoload: %s" % (app_mod.__name__.split('.')[-2], model_labels))
            for model in app_models:
                try:
                    imported_objects[model.__name__] = getattr(__import__(app_mod.__name__, {}, {}, model.__name__), model.__name__)
                except AttributeError, e:
                    print self.style.ERROR_OUTPUT("Failed to import '%s' from '%s' reason: %s" % (model.__name__, app_mod.__name__.split('.')[-2], str(e)))
                    continue   
       
        for mod_name in modules:
            mod_name = mod_name.strip()            
            mod = __import__(mod_name, globals(), locals(), ['*'])
            from inspect import getmembers, isfunction, ismodule, isclass
            print "Importing module %s" %mod_name        
            for o in getmembers(mod):                
                if isfunction(o[1]) or ismodule(o[1] or isclass(o[1]) ): 
                    imported_objects[ o[0] ] = o[1]
                    print "    %s" % o[0]
            
        
        return imported_objects
    def _handle_noargs(self, options, imported_objects):
        # XXX: (Temporary) workaround for ticket #1796: force early loading of all
        # models from installed apps. (this is fixed by now, but leaving it here
        # for people using 0.96 or older trunk (pre [5919]) versions.
        use_plain = options.get('plain', False)
        use_pythonrc = not options.get('no_pythonrc', True)
        try:
            if use_plain:
                # Don't bother loading IPython, because the user wants plain Python.
                raise ImportError
            import IPython
            # Explicitly pass an empty list as arguments, because otherwise IPython
            # would use sys.argv from this script.
            shell = IPython.Shell.IPShell(argv=[], user_ns=imported_objects)
            shell.mainloop()
        except ImportError:
            # Using normal Python shell
            import code
            try: # Try activating rlcompleter, because it's handy.
                import readline
            except ImportError:
                pass
            else:
                # We don't have to wrap the following import in a 'try', because
                # we already know 'readline' was imported successfully.
                import rlcompleter
                readline.set_completer(rlcompleter.Completer(imported_objects).complete)
                readline.parse_and_bind("tab:complete")

            # We want to honor both $PYTHONSTARTUP and .pythonrc.py, so follow system
            # conventions and get $PYTHONSTARTUP first then import user.
            if use_pythonrc:
                pythonrc = os.environ.get("PYTHONSTARTUP") 
                if pythonrc and os.path.isfile(pythonrc): 
                    try: 
                        execfile(pythonrc) 
                    except NameError: 
                        pass
                # This will import .pythonrc.py as a side-effect
                import user
            code.interact(local=imported_objects)