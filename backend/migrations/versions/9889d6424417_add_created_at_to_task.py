"""add created_at to task

Revision ID: 9889d6424417
Revises: 7042d75e8931
Create Date: 2025-12-17 14:37:52.066205

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9889d6424417'
down_revision: Union[str, Sequence[str], None] = '7042d75e8931'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
