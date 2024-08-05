def fåFil(self, filUrl):
    return self.session.get(filUrl).content
