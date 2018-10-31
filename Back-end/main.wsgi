import os, sys

here = os.path.dirname(__file__) + '/api'
activate = os.path.join(os.path.dirname(__file__), 'venv', 'bin', 'activate_this.py')
exec(compile(open(activate, "rb").read(), activate, 'exec'), dict(__file__=activate))

sys.path.append(here)

import api
application = api.app
