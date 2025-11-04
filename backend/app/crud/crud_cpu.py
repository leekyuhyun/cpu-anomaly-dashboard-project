from sqlalchemy.orm import Session
# [수정됨] 분리된 app.models.server 에서 Server 모델을 가져옵니다.
# (또는 app.models의 __init__.py를 통해 from app.models import Server 로 사용 가능)
from app.models.server import Server 

def create_server(db: Session, server_name: str) -> Server:
    """
    새로운 서버를 생성하고 DB에 추가합니다.
    (init_db.py에서 사용)
    """
    db_server = Server(name=server_name)
    db.add(db_server)
    db.commit()
    db.refresh(db_server)
    return db_server
